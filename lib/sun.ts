// Sunrise/sunset calculator — Almanac for Computers algorithm.
// Accurate to ~1–2 minutes for civil sunrise/sunset.
// All times returned in UTC; compare with Date.now() directly.

const ZENITH = 90.83333;
const GUJARAT_LAT = 22.2587;
const GUJARAT_LNG = 71.1924;

const deg2rad = (d: number) => (d * Math.PI) / 180;
const rad2deg = (r: number) => (r * 180) / Math.PI;
const mod360 = (x: number) => ((x % 360) + 360) % 360;

function calcUTC(
  date: Date,
  lat: number,
  lng: number,
  rising: boolean
): Date | null {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86_400_000);

  const lngHour = lng / 15;
  const t = dayOfYear + ((rising ? 6 : 18) - lngHour) / 24;

  const M = 0.9856 * t - 3.289;

  let L =
    M +
    1.916 * Math.sin(deg2rad(M)) +
    0.02 * Math.sin(deg2rad(2 * M)) +
    282.634;
  L = mod360(L);

  let RA = rad2deg(Math.atan(0.91764 * Math.tan(deg2rad(L))));
  RA = mod360(RA);

  const Lquadrant = Math.floor(L / 90) * 90;
  const RAquadrant = Math.floor(RA / 90) * 90;
  RA = (RA + (Lquadrant - RAquadrant)) / 15;

  const sinDec = 0.39782 * Math.sin(deg2rad(L));
  const cosDec = Math.cos(Math.asin(sinDec));

  const cosH =
    (Math.cos(deg2rad(ZENITH)) - sinDec * Math.sin(deg2rad(lat))) /
    (cosDec * Math.cos(deg2rad(lat)));
  if (cosH > 1 || cosH < -1) return null;

  let H = rising
    ? 360 - rad2deg(Math.acos(cosH))
    : rad2deg(Math.acos(cosH));
  H = H / 15;

  const T = H + RA - 0.06571 * t - 6.622;
  let UT = T - lngHour;
  UT = ((UT % 24) + 24) % 24;

  const hours = Math.floor(UT);
  const minutes = Math.floor((UT - hours) * 60);

  const out = new Date(date);
  out.setUTCHours(hours, minutes, 0, 0);
  return out;
}

export function getGujaratSun(date: Date = new Date()) {
  return {
    sunrise: calcUTC(date, GUJARAT_LAT, GUJARAT_LNG, true),
    sunset: calcUTC(date, GUJARAT_LAT, GUJARAT_LNG, false)
  };
}

export function isDaytimeInGujarat(now: Date = new Date()): boolean {
  const { sunrise, sunset } = getGujaratSun(now);
  if (!sunrise || !sunset) return true;
  const t = now.getTime();
  return t >= sunrise.getTime() && t < sunset.getTime();
}

export function formatIST(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    hour12: false
  });
}
