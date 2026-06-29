#!/usr/bin/env node
// Orion Space Agent — GitHub Actions port of n8n v5 workflow
// Runs every 6h: fetches space data → Groq AI → Telegram (2 digests)

const GROQ_KEY    = process.env.GROQ_API_KEY;
const TG_TOKEN    = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT     = '-1003942481207';
const SHEET_URL   = process.env.GOOGLE_SHEET_URL; // Apps Script web app URL

// ─── helpers ───────────────────────────────────────────────────────────────

async function fetchJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) { console.warn(`SKIP ${url} → ${res.status}`); return null; }
    return await res.json();
  } catch (e) { console.warn(`SKIP ${url} → ${e.message}`); return null; }
  finally { clearTimeout(t); }
}

async function groqCall(messages, maxTokens = 350, temperature = 0.7) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', max_tokens: maxTokens, temperature, messages }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

function parseJsonSafe(raw) {
  try {
    let s = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    const start = s.indexOf('{'); const end = s.lastIndexOf('}');
    if (start !== -1 && end !== -1) s = s.slice(start, end + 1);
    return JSON.parse(s);
  } catch { return {}; }
}

async function sendTelegram(text) {
  const body = JSON.stringify({ chat_id: TG_CHAT, text: text.slice(0, 4096), parse_mode: 'Markdown', disable_web_page_preview: true });
  const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
  });
  const data = await res.json();
  if (!data.ok) console.error('Telegram error:', data.description);
}

function istDate() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
  });
}

function clean(s, max = 0) {
  const o = String(s || '').replace(/[\\]/g, '').replace(/"/g, "'").replace(/\n|\r/g, ' ');
  return max ? o.slice(0, max) : o;
}

// ─── parallel batch helper ──────────────────────────────────────────────────
async function batchMap(items, fn, size = 4) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(...await Promise.all(items.slice(i, i + size).map(fn)));
  }
  return out;
}

// ─── main ───────────────────────────────────────────────────────────────────
async function main() {
  if (!GROQ_KEY)  { console.error('Missing GROQ_API_KEY');        process.exit(1); }
  if (!TG_TOKEN)  { console.error('Missing TELEGRAM_BOT_TOKEN');  process.exit(1); }

  // ── 1. FETCH ALL SOURCES ──────────────────────────────────────────────────
  console.log('Fetching sources...');
  const [spaceNews, apod, asteroids, sky, iss] = await Promise.all([
    fetchJson('https://api.spaceflightnewsapi.net/v4/articles/?limit=8&ordering=-published_at'),
    fetchJson('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'),
    fetchJson('https://api.nasa.gov/neo/rest/v1/feed?api_key=DEMO_KEY'),
    fetchJson('https://api.visibleplanets.dev/v3?latitude=22.2587&longitude=71.1924&constellation=true'),
    fetchJson('https://api.open-notify.org/astros.json'),
  ]);

  // ── 2. NORMALIZE ──────────────────────────────────────────────────────────
  const normalized = [];
  const seen = new Set();

  if (spaceNews?.results) {
    for (const a of spaceNews.results.slice(0, 8)) {
      if (!a.url || seen.has(a.url)) continue;
      seen.add(a.url);
      normalized.push({ type: 'global_news', source: a.news_site || 'SpaceNews',
        title: clean(a.title), summary: clean(a.summary, 280),
        url: a.url, image_url: a.image_url || '', published: a.published_at || '',
        local_relevance: 'low' });
    }
  }

  if (apod?.title && apod?.explanation) {
    normalized.push({ type: 'apod', source: 'NASA APOD',
      title: clean('NASA Picture of the Day: ' + apod.title),
      summary: clean(apod.explanation, 280),
      url: apod.hdurl || apod.url || '', image_url: apod.url || '',
      published: apod.date || new Date().toISOString(), local_relevance: 'medium' });
  }

  if (asteroids?.near_earth_objects) {
    const allNEOs = Object.values(asteroids.near_earth_objects).flat();
    const closest = allNEOs.sort((a, b) =>
      parseFloat(a.close_approach_data?.[0]?.miss_distance?.lunar || 999) -
      parseFloat(b.close_approach_data?.[0]?.miss_distance?.lunar || 999))[0];
    if (closest) {
      const app  = closest.close_approach_data?.[0];
      const diam = Math.round(((closest.estimated_diameter?.meters?.estimated_diameter_min || 0) +
                               (closest.estimated_diameter?.meters?.estimated_diameter_max || 0)) / 2);
      const lunar = parseFloat(app?.miss_distance?.lunar || 0).toFixed(1);
      normalized.push({ type: 'asteroid', source: 'NASA NEO',
        title: `Asteroid ${closest.name} passes Earth on ${app?.close_approach_date || 'soon'}`,
        summary: `Size ~${diam}m. Passes at ${lunar} lunar distances. ` +
          (closest.is_potentially_hazardous_asteroid ? 'Flagged potentially hazardous.' : 'No threat to Earth.'),
        url: 'https://cneos.jpl.nasa.gov/ca/', image_url: '',
        published: new Date().toISOString(), local_relevance: 'medium' });
    }
  }

  if (sky?.data) {
    const visible = sky.data.filter(p => p.aboveHorizon && p.altitude > 8);
    const names   = visible.map(p => p.name).join(', ') || 'No bright planets';
    const details = visible.length
      ? visible.map(p => `${p.name} at ${Math.round(p.altitude)}°`).join(' | ')
      : 'Check in-the-sky.org for tonight visibility from Gujarat.';
    normalized.push({ type: 'local_sky', source: 'LOCAL SKY Gujarat',
      title: `Visible tonight from Gujarat: ${names}`,
      summary: `From Gujarat (22N 71E): ${details}. Perfect for Orion moon gazing events!`,
      url: 'https://in-the-sky.org/newscal.php', image_url: '',
      published: new Date().toISOString(), local_relevance: 'HIGH Gujarat specific' });
  }

  if (iss?.people) {
    const crew = iss.people.filter(p => p.craft === 'ISS');
    if (crew.length) {
      normalized.push({ type: 'iss_crew', source: 'ISS Crew',
        title: `${crew.length} humans are in space right now aboard the ISS`,
        summary: `ISS crew (${crew.length}): ${crew.map(p => p.name).join(', ')}. Orbiting at 408km altitude every 90 minutes.`,
        url: 'https://www.nasa.gov/international-space-station/', image_url: '',
        published: new Date().toISOString(), local_relevance: 'medium' });
    }
  }

  normalized.sort((a, b) => (a.local_relevance.startsWith('HIGH') ? -1 : b.local_relevance.startsWith('HIGH') ? 1 : 0));
  const items = normalized.slice(0, 12);
  console.log(`Normalized ${items.length} items`);

  // ── 3. GROQ AI ENRICHMENT ─────────────────────────────────────────────────
  const SYS_ENRICH = `You are a science journalist writing factual astronomy news for readers in Gujarat, India. Write clear, accurate, educational content about space events, celestial observations, and astronomy discoveries. NO promotional language. NO marketing. NO calls to action. Return ONLY a raw JSON object with NO markdown, NO code fences: {"short_summary":"1-2 factual sentences describing what is happening in space or what can be observed. Include specific data like magnitude, altitude, distance, dates.","tweet":"factual 1-sentence summary under 240 chars with 1-2 relevant emojis","local_note":"if this is visible from Gujarat (22N 71E) tonight, provide specific observation details like altitude, direction, best viewing time in IST. Otherwise empty string.","category":"exactly one of: LocalSky / Launch / Asteroid / APOD / ISS / General"}`;

  const enriched = await batchMap(items, async item => {
    try {
      const raw = await groqCall([
        { role: 'system', content: SYS_ENRICH },
        { role: 'user', content: `Title: ${clean(item.title)}\nSummary: ${clean(item.summary, 260)}\nLocal flag: ${item.local_relevance}` },
      ], 350, 0.7);
      const ai = parseJsonSafe(raw);
      return { ...item, ai_summary: ai.short_summary || item.summary, tweet: ai.tweet || '', local_note: ai.local_note || '', category: ai.category || 'General', timestamp: new Date().toISOString() };
    } catch (e) {
      console.warn('Groq enrich error:', e.message);
      return { ...item, ai_summary: item.summary, tweet: item.title, local_note: '', category: 'General', timestamp: new Date().toISOString() };
    }
  });
  console.log(`Enriched ${enriched.length} articles`);

  // ── 4. SAVE TO GOOGLE SHEETS ──────────────────────────────────────────────
  if (SHEET_URL) {
    try {
      const rows = enriched.map(i => ({
        'Timestamp':       i.timestamp,
        'Type':            i.type,
        'Source':          i.source,
        'Title':           i.title,
        'AI Summary':      i.ai_summary,
        'Tweet':           i.tweet,
        'Local Note':      i.local_note,
        'Category':        i.category,
        'Local Relevance': i.local_relevance,
        'URL':             i.url,
        'Image URL':       i.image_url,
        'Published At':    i.published,
      }));
      await fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rows),
      });
      console.log(`Saved ${rows.length} rows to Google Sheets`);
    } catch (e) {
      console.warn('Google Sheets write failed:', e.message);
    }
  } else {
    console.log('GOOGLE_SHEET_URL not set — skipping Sheets');
  }

  // ── 6. BUILD & SEND REGULAR DIGEST ───────────────────────────────────────
  const local       = enriched.filter(i => i.local_relevance.startsWith('HIGH'));
  const apodItem    = enriched.find(i => i.type === 'apod');
  const asteroidItem = enriched.find(i => i.type === 'asteroid');
  const crewItem    = enriched.find(i => i.type === 'iss_crew');
  const newsItems   = enriched.filter(i => i.type === 'global_news').slice(0, 3);
  const today       = istDate();

  let msg = `🛸 *ORION SPACE DIGEST*\n📅 ${today}\n\n`;

  if (local.length > 0) {
    msg += '🌙 *GUJARAT SKY TONIGHT*\n';
    for (const it of local.slice(0, 2)) {
      msg += `• ${it.ai_summary || it.title}\n`;
      if (it.local_note?.length > 3) msg += `  ${it.local_note}\n`;
    }
    msg += '\n';
  }

  if (apodItem) {
    msg += `🔭 *NASA PICTURE OF THE DAY*\n${(apodItem.title || '').replace('NASA Picture of the Day: ', '')}`;
    if (apodItem.ai_summary) msg += `\n${apodItem.ai_summary}`;
    msg += '\n\n';
  }

  if (asteroidItem) msg += `☄️ *ASTEROID WATCH*\n${asteroidItem.ai_summary || asteroidItem.summary}\n\n`;
  if (crewItem)     msg += `👨‍🚀 *IN SPACE RIGHT NOW*\n${crewItem.ai_summary || crewItem.summary}\n\n`;

  if (newsItems.length > 0) {
    msg += '📰 *SPACE NEWS*\n';
    for (const n of newsItems) {
      const s = n.ai_summary || n.summary;
      if (s) msg += `• ${s}\n`;
    }
  }

  await sendTelegram(msg);
  console.log('Sent regular digest');

  // ── 5. EDITORIAL SCORING ──────────────────────────────────────────────────
  const SYS_SCORE = `You are the Chief Editor of Orion Space Digest. HIGH PRIORITY (8-10): visible sky events, moon phases, meteor showers, comets, eclipses, NASA APOD, Hubble/JWST discoveries, Mars missions, major SpaceX launches, rare celestial events, anything visible from India/Gujarat. MEDIUM (5-7): space missions, exoplanets, black holes, educational astronomy. LOW (1-4): corporate announcements, funding rounds, executive appointments, startup valuations, business news without scientific value. Add +2 if visible from India/Gujarat. Add +1 if naked eye or binoculars. Penalize duplicate topics. Return ONLY valid JSON: {"score":X,"reason":"brief explanation"}`;

  const scored = await batchMap(enriched, async item => {
    try {
      const raw = await groqCall([
        { role: 'system', content: SYS_SCORE },
        { role: 'user', content: `Title: ${clean(item.title)}\nSummary: ${clean(item.ai_summary, 260)}\nCategory: ${item.category || 'General'}\nType: ${item.type}\nLocal Relevance: ${item.local_relevance}\nLocal Note: ${item.local_note}` },
      ], 200, 0.2);
      const d = parseJsonSafe(raw);
      return { ...item, editorial_score: d.score || 5, score_reason: d.reason || '' };
    } catch {
      return { ...item, editorial_score: 5, score_reason: '' };
    }
  });

  // Filter ≥6, enforce diversity, top 3
  const filtered = scored.filter(i => i.editorial_score >= 6);
  const seenKeys = new Set();
  const diverse  = [];
  for (const item of filtered) {
    const key = `${item.type}_${item.category}`;
    if (!seenKeys.has(key) || item.editorial_score >= 9) { diverse.push(item); seenKeys.add(key); }
  }
  diverse.sort((a, b) => b.editorial_score - a.editorial_score);
  const top3 = diverse.slice(0, 3);

  if (top3.length === 0) { console.log('No high-scoring stories; skipping editorial digest'); return; }

  // ── 6. REWRITE TOP 3 ──────────────────────────────────────────────────────
  const SYS_REWRITE = 'You are a senior science writer for Orion Space Digest, a premium astronomy publication for Gujarat, India. Rewrite the given article summary to be engaging, accurate, and suitable for astronomy enthusiasts. Keep it 2-3 sentences. Use active voice. Make it exciting but factual.';

  const rewritten = await Promise.all(top3.map(async item => {
    try {
      const text = await groqCall([
        { role: 'system', content: SYS_REWRITE },
        { role: 'user', content: `Title: ${item.title}\nSummary: ${clean(item.ai_summary, 500)}\nCategory: ${item.category}\nEditorial Score: ${item.editorial_score}\nLocal Note: ${item.local_note}\n\nRewrite this for astronomy enthusiasts in Gujarat.` },
      ], 300, 0.4);
      return { ...item, rewritten_story: text.replace(/```markdown/gi, '').replace(/```/g, '').trim() };
    } catch {
      return { ...item, rewritten_story: item.ai_summary || item.summary };
    }
  }));

  // ── 7. SEND EDITORIAL DIGEST ──────────────────────────────────────────────
  let editMsg = `🛸 *ORION SPACE DIGEST — EDITOR'S PICKS*\n📅 ${today}\n\n`;
  editMsg += `_Top ${rewritten.length} stories for astronomy enthusiasts, telescope owners, and stargazers_\n\n`;
  editMsg += '━━━━━━━━━━━━━━━━━━━━\n\n';

  for (let i = 0; i < rewritten.length; i++) {
    const story = rewritten[i].rewritten_story;
    if (story) {
      editMsg += story + '\n\n';
      if (i < rewritten.length - 1) editMsg += '━━━━━━━━━━━━━━━━━━━━\n\n';
    }
  }
  editMsg += '━━━━━━━━━━━━━━━━━━━━\n_Curated by Orion Space Agent AI_';

  await sendTelegram(editMsg);
  console.log('Sent editorial digest');
  console.log('Done.');
}

main().catch(e => { console.error(e); process.exit(1); });
