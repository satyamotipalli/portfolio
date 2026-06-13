"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nav, profile } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:pt-5">
      <nav className="flex w-full items-center justify-end">
        {/* Floating pill */}
        <div
          className={`flex items-center gap-1 rounded-full border px-3 py-2.5 transition-all duration-300 ${
            scrolled
              ? "border-border-bright bg-background/80 shadow-[0_0_30px_-10px_var(--glow)] backdrop-blur-md"
              : "border-border-base bg-background/50 backdrop-blur-sm"
          }`}
        >
          {/* Name + status dot */}
          <a href="#top" className="flex items-center gap-2 px-3 font-mono text-sm font-semibold text-foreground">
            {profile.shortName.split(" ").slice(0, 1)} Motipalli
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
          </a>

          <span className="mx-1 hidden h-5 w-px bg-border-bright md:block" />

          {/* Desktop links */}
          <ul className="hidden items-center md:flex">
            {nav.slice(0, -1).map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3.5 py-2.5 font-mono text-[13px] text-muted transition-colors hover:bg-accent/10 hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="ml-1 rounded-full border border-accent/40 px-4 py-2.5 font-mono text-[13px] text-accent transition-all hover:bg-accent/10"
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-accent md:hidden"
            onClick={() => setOpen((val) => !val)}
          >
            <span className="font-mono text-lg">{open ? "✕" : "≡"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-2xl border border-border-base bg-background/95 backdrop-blur-md md:hidden"
          >
            {nav.map((item) => (
              <li key={item.href} className="border-b border-border-base/60 last:border-0">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-3.5 font-mono text-sm text-muted hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
