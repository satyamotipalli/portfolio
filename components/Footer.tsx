import { profile } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-border-base">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 py-8 text-center">
        <p className="font-mono text-xs text-muted">
          © 2026 {profile.shortName} — Architected with{" "}
          <span className="text-accent">Next.js</span> &amp;{" "}
          <span className="text-accent">Framer Motion</span>, delivered at AI-speed.
        </p>
        <p className="font-mono text-[11px] text-muted/70">
          Designed &amp; built in the terminal. <span className="blink text-accent">_</span>
        </p>
      </div>
    </footer>
  );
}
