"use client";

import { motion } from "framer-motion";

type IconProps = { hovered: boolean };

export function PlanetIcon({ hovered }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <motion.circle
        cx="12" cy="12" r="6"
        animate={hovered ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 4, repeat: hovered ? Infinity : 0, ease: "linear" }}
        style={{ transformOrigin: "12px 12px" }}
      />
      <motion.ellipse
        cx="12" cy="12" rx="10" ry="3.4"
        transform="rotate(-20 12 12)"
        animate={hovered ? { rotate: [-20, 340] } : { rotate: -20 }}
        transition={{ duration: 6, repeat: hovered ? Infinity : 0, ease: "linear" }}
        style={{ transformOrigin: "12px 12px" }}
      />
    </svg>
  );
}

export function StarIcon({ hovered }: IconProps) {
  return (
    <motion.svg
      viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"
      animate={hovered ? { rotate: 360, scale: [1, 1.25, 1] } : { rotate: 0, scale: 1 }}
      transition={{ duration: 1.4, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
    >
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z" />
    </motion.svg>
  );
}

export function NebulaIcon({ hovered }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <defs>
        <radialGradient id="neb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle
        cx="12" cy="12" r="9" fill="url(#neb)"
        animate={hovered ? { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 0.7 }}
        transition={{ duration: 1.8, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
        style={{ transformOrigin: "12px 12px" }}
      />
      <motion.circle
        cx="12" cy="12" r="3" fill="currentColor"
        animate={hovered ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.9 }}
        transition={{ duration: 1.2, repeat: hovered ? Infinity : 0 }}
      />
    </svg>
  );
}

export function CometIcon({ hovered }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <motion.g
        animate={hovered ? { x: [0, 5, 0], y: [0, -5, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 0.9, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
      >
        <circle cx="17" cy="7" r="3" fill="currentColor" />
        <path d="M14.5 9.5 L4 20" strokeOpacity="0.9" />
        <path d="M13 11 L6 18" strokeOpacity="0.5" />
        <path d="M16 11 L9 19" strokeOpacity="0.5" />
      </motion.g>
    </svg>
  );
}

export function OrbitIcon({ hovered }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(30 12 12)" strokeOpacity="0.5" />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: hovered ? 1.6 : 6, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "12px 12px" }}
      >
        <g transform="rotate(30 12 12)">
          <circle cx="22" cy="12" r="1.6" fill="currentColor" />
        </g>
      </motion.g>
    </svg>
  );
}

export function SignalIcon({ hovered }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="18" r="2" fill="currentColor" />
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${12 - 4 - i * 3} ${14 - i * 2} Q12 ${10 - i * 2} ${12 + 4 + i * 3} ${14 - i * 2}`}
          strokeOpacity={0.8 - i * 0.2}
          animate={hovered ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.6 }}
          transition={{ duration: 1.2, repeat: hovered ? Infinity : 0, delay: i * 0.18 }}
        />
      ))}
    </svg>
  );
}

export function RocketIcon({ hovered }: IconProps) {
  return (
    <motion.svg
      viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"
      animate={hovered ? { y: [0, -3, 0], rotate: [-3, 3, -3] } : { y: 0, rotate: 0 }}
      transition={{ duration: 0.8, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
    >
      <path d="M12 2c2.5 2 4 5 4 8.5v4l2 2v3l-3-1-3 1-3-1-3 1v-3l2-2v-4C8 7 9.5 4 12 2z" />
      <circle cx="12" cy="9" r="1.4" fill="rgb(var(--bg))" />
    </motion.svg>
  );
}
