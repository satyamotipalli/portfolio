import { skills } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Skills() {
  return (
    <section id="stack" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
      <SectionHeading index="05" title="The Stack" command="cat uses.md" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <Reveal key={group.label} delay={i * 0.06}>
            <div className="card-base h-full p-5 transition-colors hover:border-accent/40">
              <h3 className="font-mono text-sm text-accent">
                <span className="text-muted">{"// "}</span>
                {group.label}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-border-base bg-background-elevated px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
