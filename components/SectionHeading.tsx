import Reveal from "./Reveal";

type Props = {
  index: string; // e.g. "01"
  title: string;
  command: string; // e.g. "cat about.md"
};

export default function SectionHeading({ index, title, command }: Props) {
  return (
    <Reveal className="mb-12">
      <p className="font-mono text-sm text-accent/80">
        <span className="text-muted">{index}.</span> ~/{" "}
        <span className="text-accent-2">$</span> {command}
      </p>
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-4 h-px w-24 bg-gradient-to-r from-accent to-transparent" />
    </Reveal>
  );
}
