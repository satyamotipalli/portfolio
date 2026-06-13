"use client";

import { motion } from "framer-motion";

// Pointy-top hexagon vertices around center (200,200), radius 140.
const v = [
  { x: 200, y: 60 }, // top
  { x: 321, y: 130 }, // upper-right
  { x: 321, y: 270 }, // lower-right
  { x: 200, y: 340 }, // bottom
  { x: 79, y: 270 }, // lower-left
  { x: 79, y: 130 }, // upper-left
];

const hexPoints = v.map((p) => `${p.x},${p.y}`).join(" ");

// Spokes that carry a travelling particle, with a stagger delay.
const travellers = [
  { to: v[5], delay: 0 }, // upper-left
  { to: v[2], delay: 1.3 }, // lower-right
  { to: v[0], delay: 2.5 }, // top
];

export default function NetworkGraphic() {
  return (
    <div className="relative aspect-square w-full max-w-[440px]">
      {/* tight bright halo behind the core */}
      <div className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/30 blur-[40px]" />

      <svg viewBox="0 0 400 400" className="relative h-full w-full">
        <defs>
          <radialGradient id="ng-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="18%" stopColor="var(--accent)" stopOpacity="0.9" />
            <stop offset="45%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ng-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* static dotted orbit rings (centered, full circles) */}
        <circle cx="200" cy="200" r="160" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 9" opacity="0.4" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="var(--border-bright)" strokeWidth="1" strokeDasharray="1 10" opacity="0.5" />

        {/* spokes core -> vertices */}
        {v.map((p, i) => (
          <line key={`s-${i}`} x1="200" y1="200" x2={p.x} y2={p.y} stroke="url(#ng-edge)" strokeWidth="1.1" opacity="0.8" />
        ))}

        {/* hexagon outline */}
        <polygon points={hexPoints} fill="none" stroke="url(#ng-edge)" strokeWidth="1.5" />

        {/* travelling particles along spokes */}
        {travellers.map((t, i) => (
          <motion.circle
            key={`t-${i}`}
            r="3"
            fill="var(--accent)"
            initial={{ cx: 200, cy: 200, opacity: 0 }}
            animate={{ cx: [200, t.to.x], cy: [200, t.to.y], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.4, delay: t.delay, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
          />
        ))}

        {/* vertex nodes (gentle pulse) */}
        {v.map((p, i) => (
          <motion.circle
            key={`n-${i}`}
            cx={p.x}
            cy={p.y}
            r="6.5"
            fill="var(--accent)"
            animate={{ opacity: [0.5, 1, 0.5], r: [5.5, 7, 5.5] }}
            transition={{ duration: 2.6 + (i % 3) * 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* glowing core */}
        <circle cx="200" cy="200" r="80" fill="url(#ng-core)" />
        <motion.circle
          cx="200"
          cy="200"
          r="22"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          animate={{ r: [20, 32, 20], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        />
        <circle cx="200" cy="200" r="15" fill="var(--accent)" />
        <circle cx="200" cy="200" r="7.5" fill="#ffffff" />
      </svg>
    </div>
  );
}
