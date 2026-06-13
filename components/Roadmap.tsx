import { roadmap } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Roadmap() {
  const done = roadmap.filter((r) => r.done).length;
  return (
    <section id="roadmap" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
      <SectionHeading index="04" title="The Engineering Roadmap" command="cat roadmap.md" />

      <Reveal className="mb-8">
        <div className="card-base flex items-center justify-between p-4 font-mono text-sm">
          <span className="text-muted">progress</span>
          <span className="text-accent">
            {done}/{roadmap.length} complete
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background-elevated">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
            style={{ width: `${(done / roadmap.length) * 100}%` }}
          />
        </div>
      </Reveal>

      <div className="grid gap-3 sm:grid-cols-2">
        {roadmap.map((item, i) => (
          <Reveal key={item.n} delay={(i % 2) * 0.05}>
            <div className="card-base flex items-center gap-4 p-4 transition-colors hover:border-accent/40">
              <span className="font-mono text-sm text-muted">{item.n}</span>
              <span className="flex-1 text-sm text-foreground">{item.title}</span>
              <span
                className={`font-mono text-xs ${item.done ? "text-accent" : "text-muted"}`}
              >
                {item.done ? "✓ done" : "○ next"}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
