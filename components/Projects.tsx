"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function MiniTerminal({ lines }: { lines: string[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-base bg-[#05080f] font-mono text-[12px]">
      <div className="flex items-center gap-1.5 border-b border-border-base px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
      </div>
      <div className="space-y-1 px-3 py-3">
        {lines.map((l, i) => (
          <p key={i} className={l.startsWith("$") ? "text-foreground" : "pl-1 text-accent/80"}>
            {l.startsWith("$") ? (
              <>
                <span className="text-accent-2">$</span>
                {l.slice(1)}
              </>
            ) : (
              l
            )}
          </p>
        ))}
        <p className="text-foreground">
          <span className="text-accent-2">$</span> <span className="blink text-accent">_</span>
        </p>
      </div>
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <Reveal>
      <motion.article
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={`card-base group p-6 transition-colors hover:border-accent/40 hover:shadow-[0_0_40px_-16px_var(--glow)] sm:p-8 ${
          project.featured ? "ring-1 ring-accent/15" : ""
        }`}
      >
        <div className="grid items-center gap-7 md:grid-cols-2">
          {/* Text side */}
          <div>
            <div className="flex items-center gap-3 font-mono text-xs text-muted">
              {project.featured && (
                <span className="rounded border border-accent/40 px-1.5 py-0.5 text-accent">featured</span>
              )}
              <span>{project.period}</span>
            </div>

            <h3 className="mt-3 text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
              {project.name}
            </h3>
            {(project.client || project.role) && (
              <p className="mt-1 font-mono text-xs text-accent-2">
                {[project.client, project.role].filter(Boolean).join(" · ")}
              </p>
            )}

            <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>

            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-2 overflow-hidden"
                >
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5 text-xs text-muted">
                      <span className="mt-0.5 font-mono text-accent">▹</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            <button
              onClick={() => setOpen((v) => !v)}
              className="mt-4 font-mono text-xs text-accent transition-colors hover:text-accent-2"
            >
              {open ? "− hide contributions" : "+ key contributions"}
            </button>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <li key={t} className="rounded bg-background-elevated px-2 py-0.5 font-mono text-[11px] text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Terminal side */}
          <MiniTerminal lines={project.terminal} />
        </div>
      </motion.article>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
      <SectionHeading index="02" title="Projects" command="git log ./projects" />
      <div className="space-y-5">
        {projects.map((p) => (
          <ProjectRow key={p.name} project={p} />
        ))}
      </div>
    </section>
  );
}
