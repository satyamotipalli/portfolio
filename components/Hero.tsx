"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/content";
import NetworkGraphic from "./NetworkGraphic";

const bootLines = [
  { prompt: true, text: "whoami" },
  { prompt: false, text: profile.name },
  { prompt: true, text: "cat role.txt" },
  { prompt: false, text: `${profile.title} · ${profile.yearsExperience} yrs · ${profile.location}` },
  { prompt: true, text: "./stack --primary" },
  { prompt: false, text: "Angular · React · Next.js · Node.js · NestJS · AI (LangChain · OpenAI)" },
];

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-7xl px-5 pt-36 pb-20 sm:pt-44 sm:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border-bright bg-background-elevated/60 px-3 py-1.5 font-mono text-xs text-muted backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {profile.title}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-5 text-5xl font-black leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem]"
          >
            Building Full-Stack Apps.
            <br />
            <span className="bg-gradient-to-r from-accent via-accent-2 to-[#ec4899] bg-clip-text text-transparent">
              Delivering at AI-Speed.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted"
          >
            I&apos;m <span className="text-foreground">{profile.shortName}</span>, a{" "}
            {profile.title} at Sparity Soft Technology with {profile.yearsExperience} years
            shipping production apps across Angular, React, Next.js and Node.js —
            now weaving in autonomous AI with LangChain and OpenAI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 font-mono text-sm font-semibold text-[#04121c] transition-all hover:shadow-[0_0_28px_var(--glow)]"
            >
              View my work
              <span aria-hidden>→</span>
            </a>
            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-2 rounded-lg border border-border-bright bg-background-elevated/60 px-6 py-3.5 font-mono text-sm text-foreground transition-all hover:border-accent hover:text-accent"
            >
              <svg
                aria-hidden
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CV
            </a>
          </motion.div>
        </div>

        {/* Right: animated network graphic */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <NetworkGraphic />
        </motion.div>
      </div>

      {/* Terminal concierge block */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="card-base mt-16 overflow-hidden font-mono text-sm"
      >
        <div className="flex items-center gap-2 border-b border-border-base bg-background-elevated px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 text-xs text-muted">satya@portfolio — bash</span>
        </div>
        <div className="space-y-1.5 px-4 py-4">
          {bootLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.18 }}
              className={line.prompt ? "text-foreground" : "pl-4 text-muted"}
            >
              {line.prompt ? (
                <>
                  <span className="text-accent-2">satya@portfolio</span>
                  <span className="text-muted">:</span>
                  <span className="text-accent">~</span>
                  <span className="text-muted">$ </span>
                  <span>{line.text}</span>
                </>
              ) : (
                <span>↳ {line.text}</span>
              )}
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + bootLines.length * 0.18 }}
            className="text-foreground"
          >
            <span className="text-accent-2">satya@portfolio</span>
            <span className="text-muted">:</span>
            <span className="text-accent">~</span>
            <span className="text-muted">$ </span>
            <span className="blink text-accent">_</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
