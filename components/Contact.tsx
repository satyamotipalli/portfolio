"use client";

import { useState } from "react";
import { profile } from "@/lib/content";
import Reveal from "./Reveal";

// Web3Forms access key — get yours free (no signup) at https://web3forms.com/#start
// by entering the email where submissions should land. Safe to commit: it can only
// send TO your configured email, never read anything.
const WEB3FORMS_ACCESS_KEY = "97dfd2a2-168e-49a0-a68d-0686e7d1c3ca";

const links = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { label: "GitHub", value: "github.com/Satyavv2", href: profile.github },
  { label: "LinkedIn", value: "linkedin.com/in/satyanarayanavvm", href: profile.linkedin },
];

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Portfolio enquiry from ${form.name || "someone"}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
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
            {/* honeypot: real users leave this empty, bots fill it → silently dropped */}
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-md bg-gradient-to-r from-accent to-accent-2 px-6 py-3.5 font-mono text-sm font-semibold text-[#04121c] transition-all hover:shadow-[0_0_24px_var(--glow)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? "sending..." : "send_message()"}
            </button>
            {status === "success" && (
              <p className="font-mono text-sm text-accent" role="status">
                ↳ message sent — I&apos;ll get back to you soon. ✓
              </p>
            )}
            {status === "error" && (
              <p className="font-mono text-sm text-[#ff5f56]" role="status">
                ↳ something went wrong. Please email me directly at {profile.email}.
              </p>
            )}
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
