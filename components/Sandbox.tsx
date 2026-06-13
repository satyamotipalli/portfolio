import { sandbox } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const statusColor: Record<string, string> = {
  done: "text-accent border-accent/40",
  wip: "text-accent-2 border-accent-2/40",
  idea: "text-muted border-border-bright",
};

export default function Sandbox() {
  return (
    <section id="sandbox" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
      <SectionHeading index="07" title="Sandbox" command="ls ~/experiments" />
      <Reveal>
        <div className="card-base divide-y divide-border-base overflow-hidden font-mono text-sm">
          {sandbox.map((exp) => (
            <div key={exp.name} className="flex flex-col gap-1 p-5 transition-colors hover:bg-background-elevated/40 sm:flex-row sm:items-center sm:gap-5">
              <span className="text-accent">~/{exp.name}</span>
              <span className="flex-1 font-sans text-sm text-muted">{exp.desc}</span>
              <span className={`self-start rounded border px-2 py-0.5 text-[11px] ${statusColor[exp.status]}`}>
                {exp.status}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
