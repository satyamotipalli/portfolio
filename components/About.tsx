import { about } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
      <SectionHeading index="01" title="About me" command="cat about.md" />

      <div className="grid gap-10 md:grid-cols-[1.6fr_1fr]">
        <Reveal className="space-y-4">
          {about.summary.map((p, i) => (
            <p key={i} className="leading-relaxed text-muted">
              {p}
            </p>
          ))}

          <div className="card-base mt-6 p-4 font-mono text-sm">
            <p className="text-muted">
              <span className="text-accent-2">{"//"}</span> education
            </p>
            <p className="mt-1 text-foreground">{about.education.degree}</p>
            <p className="text-muted">
              {about.education.school} · {about.education.year}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            {about.stats.map((s) => (
              <div
                key={s.label}
                className="card-base flex flex-col justify-center p-5 transition-colors hover:border-accent/40"
              >
                <span className="font-mono text-2xl font-bold text-accent text-glow">
                  {s.value}
                </span>
                <span className="mt-1 text-xs text-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
