"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

const stages = [
  { label: "Database", sub: "PostgreSQL · MongoDB", icon: "▤" },
  { label: "Backend API", sub: "Node.js · NestJS · Python", icon: "⚙" },
  { label: "AI Layer", sub: "LangChain · OpenAI", icon: "✦" },
  { label: "Frontend UI", sub: "Angular · React · Next.js", icon: "▣" },
];

export default function Architecture() {
  return (
    <section id="architecture" className="mx-auto max-w-7xl px-5 py-20 text-center sm:py-28">
      <Reveal>
        <p className="font-mono text-sm text-accent">
          <span className="text-accent-2">$</span> ./architecture --explain
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          The Architecture is Everything.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
          Every app I ship follows the same backbone — a clean flow from data to interface,
          with an AI layer woven through. Strong contracts at each boundary make the whole
          system fast to build and easy to scale.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-14 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-center">
          {stages.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center gap-3 md:flex-row">
              <motion.div
                whileHover={{ y: -3 }}
                className="card-base relative w-full min-w-[180px] p-5 md:w-auto"
              >
                <span className="font-mono text-2xl text-accent">{s.icon}</span>
                <p className="mt-2 font-semibold text-foreground">{s.label}</p>
                <p className="mt-1 font-mono text-[11px] text-muted">{s.sub}</p>
                <motion.span
                  className="absolute right-3 top-3 h-2 w-2 rounded-full bg-accent"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
              </motion.div>
              {i < stages.length - 1 && (
                <span className="font-mono text-accent-2 md:px-1">
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
