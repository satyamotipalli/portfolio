import { posts } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Blog() {
  return (
    <section id="blog" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
      <SectionHeading index="06" title="Writing" command="ls ./blog --recent" />
      <div className="grid gap-5 md:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.title} delay={i * 0.06}>
            <a
              href={post.href}
              className="card-base group flex h-full flex-col p-5 transition-colors hover:border-accent/40"
            >
              <div className="flex items-center justify-between font-mono text-[11px] text-muted">
                <span className="rounded border border-border-base px-2 py-0.5 text-accent-2">
                  {post.tag}
                </span>
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <h3 className="mt-4 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <span className="mt-4 font-mono text-xs text-accent">read →</span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
