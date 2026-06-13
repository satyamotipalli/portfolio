"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products, type Product } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function ProductCard({ product, delay }: { product: Product; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={delay}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="card-base flex h-full flex-col p-6 transition-colors hover:border-accent/40 hover:shadow-[0_0_30px_-12px_var(--glow)]"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl text-accent">◆</span>
          <span className="rounded border border-accent/30 px-2 py-0.5 font-mono text-[11px] text-accent">
            shipped
          </span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{product.blurb}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {product.metrics.map((m) => (
            <div key={m.label} className="rounded-md border border-border-base bg-background-elevated p-2 text-center">
              <p className="font-mono text-[11px] text-accent-2">{m.value}</p>
              <p className="font-mono text-[10px] text-muted">{m.label}</p>
            </div>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-1.5 overflow-hidden border-t border-border-base pt-4"
            >
              {product.details.map((d) => (
                <li key={d} className="flex gap-2 text-xs text-muted">
                  <span className="mt-0.5 font-mono text-accent">▹</span>
                  {d}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-between border-t border-border-base pt-4">
          <ul className="flex flex-wrap gap-1.5">
            {product.tech.slice(0, 3).map((t) => (
              <li key={t} className="rounded bg-background-elevated px-2 py-0.5 font-mono text-[11px] text-muted">
                {t}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setOpen((v) => !v)}
            className="font-mono text-xs text-accent transition-colors hover:text-accent-2"
          >
            {open ? "− less" : "+ expand"}
          </button>
        </div>
      </motion.div>
    </Reveal>
  );
}

export default function Products() {
  return (
    <section id="products" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
      <SectionHeading index="02" title="Products" command="ls ./products --shipped" />
      <div className="grid gap-5 md:grid-cols-3">
        {products.map((p, i) => (
          <ProductCard key={p.name} product={p} delay={i * 0.07} />
        ))}
      </div>
    </section>
  );
}
