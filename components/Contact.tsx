"use client";

import { useState } from "react";
import { profile } from "@/lib/content";
import Reveal from "./Reveal";

const links = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { label: "GitHub", value: "github.com/Satyavv2", href: profile.github },
  { label: "LinkedIn", value: "linkedin.com/in/satyanarayanavvm", href: profile.linkedin },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name || "someone"}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ""}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  }

  const field =
    "w-full rounded-md border border-border-base bg-background-elevated px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent/60";

  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-24 sm:py-32">
      <Reveal className="text-center">
        <p className="font-mono text-sm text-accent">
          <span className="text-accent-2">$</span> ./contact --now
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Have a product to build?{" "}
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
            Let&apos;s ship it.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
          Open to full-stack and AI-integration work. Drop me a line and I&apos;ll get back to you.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <Reveal>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              type="text"
              placeholder="your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={field}
            />
            <input
              required
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={field}
            />
            <textarea
              required
              rows={5}
              placeholder="what are we building?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`${field} resize-none`}
            />
            <button
              type="submit"
              className="w-full rounded-md bg-gradient-to-r from-accent to-accent-2 px-6 py-3.5 font-mono text-sm font-semibold text-[#04121c] transition-all hover:shadow-[0_0_24px_var(--glow)]"
            >
              send_message()
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="grid h-full gap-3 sm:grid-cols-2 md:grid-cols-1">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="card-base block p-4 transition-colors hover:border-accent/40"
                >
                  <span className="font-mono text-xs text-accent-2">{l.label}</span>
                  <span className="mt-1 block truncate font-mono text-sm text-foreground">
                    {l.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
