import { experience } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
      <SectionHeading index="03" title="Experience" command="git log --author=satya" />

      <Reveal>
        <div className="card-base relative p-6 sm:p-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-xl font-semibold text-foreground">
              {experience.role}{" "}
              <span className="text-accent">@ {experience.company}</span>
            </h3>
            <span className="font-mono text-sm text-muted">{experience.period}</span>
          </div>

          <p className="mt-4 leading-relaxed text-muted">{experience.blurb}</p>

          <ul className="mt-5 space-y-2.5">
            {experience.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm text-muted">
                <span className="mt-1 font-mono text-accent">▹</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
