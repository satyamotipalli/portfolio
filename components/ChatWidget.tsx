"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { chat } from "@/lib/content";
import { answerLocally, knowledge, type Hit } from "@/lib/chat-kb";

type Source = Pick<Hit, "id" | "title" | "href">;
type Message = { role: "user" | "assistant"; text: string; hits?: Hit[]; sources?: Source[] };

// RAG backend (Cloudflare Worker + Gemini), inlined at build time. When unset or unreachable, the
// widget falls back to in-browser retrieval over the same résumé chunks.
const CHAT_API = process.env.NEXT_PUBLIC_CHAT_API;

const GREETING: Message[] = [{ role: "assistant", text: chat.greeting }];

async function askBackend(
  api: string,
  question: string,
  history: Message[],
  signal: AbortSignal,
  onUpdate: (text: string, sources: Source[]) => void,
) {
  const res = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Skip the canned greeting; send only real turns.
    body: JSON.stringify({ question, history: history.slice(1).map(({ role, text }) => ({ role, text })) }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(`Chat API responded ${res.status}`);

  const sources = (res.headers.get("X-Sources") ?? "")
    .split(",")
    .flatMap((id) => knowledge.filter((k) => k.id === id))
    .slice(0, 3)
    .map(({ id, title, href }) => ({ id, title, href }));

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    if (text.trim()) onUpdate(text, sources);
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(GREETING);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<number | undefined>(undefined);
  const pending = useRef<AbortController | null>(null);

  // Every open starts a fresh conversation. Resetting here (not on close) keeps the old
  // messages visible while the panel animates out.
  function start() {
    setMessages(GREETING);
    setInput("");
    setThinking(false);
    setOpen(true);
  }

  const close = useCallback(() => {
    window.clearTimeout(replyTimer.current);
    pending.current?.abort();
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  function ask(question: string) {
    const q = question.trim();
    if (!q || thinking) return;
    const history = messages;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);

    const answerFromResume = () => {
      setMessages((m) => [...m, { role: "assistant", ...answerLocally(q) }]);
      setThinking(false);
    };

    if (!CHAT_API) {
      // Brief pause so the reply reads as a response rather than an instant swap.
      replyTimer.current = window.setTimeout(answerFromResume, 450);
      return;
    }

    const controller = new AbortController();
    pending.current = controller;
    let started = false;

    askBackend(CHAT_API, q, history, controller.signal, (text, sources) => {
      const first = !started;
      started = true;
      const reply: Message = { role: "assistant", text, sources };
      setThinking(false);
      setMessages((m) => (first ? [...m, reply] : [...m.slice(0, -1), reply]));
    })
      .catch(() => undefined)
      .finally(() => {
        if (controller.signal.aborted) return;
        // Backend unreachable or returned nothing: answer from the in-browser index instead.
        if (!started) answerFromResume();
        else setThinking(false);
      });
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-label={chat.title}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ transformOrigin: "bottom right" }}
            className="flex h-[min(520px,calc(100dvh-7rem))] w-[min(370px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border-bright bg-background/95 shadow-[0_0_40px_-12px_var(--glow)] backdrop-blur-md"
          >
            {/* Terminal-style title bar */}
            <div className="flex items-center gap-2 border-b border-border-base px-4 py-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              </span>
              <span className="ml-2 font-mono text-xs text-foreground">{chat.prompt}</span>
              <span className="ml-auto flex items-center gap-1.5 rounded-full border border-accent/30 px-2 py-0.5 font-mono text-[10px] text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {CHAT_API ? chat.modeLive : chat.mode}
              </span>
              <button
                aria-label="Close chat"
                onClick={close}
                className="ml-1 flex h-6 w-6 items-center justify-center rounded-full font-mono text-sm text-muted transition-colors hover:text-accent"
              >
                ✕
              </button>
            </div>

            {/* Conversation */}
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <p
                    key={i}
                    className="ml-auto w-fit max-w-[85%] rounded-xl rounded-br-sm bg-accent/15 px-3 py-2 text-sm text-foreground"
                  >
                    {m.text}
                  </p>
                ) : (
                  <div key={i} className="max-w-[94%] space-y-2">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                      <span className="font-mono text-accent-2">↳ </span>
                      {m.text}
                    </p>
                    {m.hits?.map((h) => (
                      <a
                        key={h.id}
                        href={h.href}
                        className="block rounded-lg border border-border-base bg-surface/70 px-3 py-2 transition-colors hover:border-accent/40"
                      >
                        <span className="block font-mono text-xs text-accent">{h.title}</span>
                        <span className="mt-1 block whitespace-pre-line text-[13px] leading-relaxed text-muted">
                          {h.body}
                        </span>
                      </a>
                    ))}
                    {m.sources && m.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.sources.map((s) => (
                          <a
                            key={s.id}
                            href={s.href}
                            className="rounded-full border border-border-bright px-2.5 py-1 font-mono text-[10px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
                          >
                            {s.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              )}

              {thinking && (
                <p className="font-mono text-sm text-accent">
                  ↳ {chat.thinking}
                  <span className="blink">_</span>
                </p>
              )}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {chat.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="rounded-full border border-border-bright px-3 py-1.5 text-left font-mono text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Prompt input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-border-base px-4 py-3"
            >
              <span className="font-mono text-sm text-accent-2" aria-hidden="true">
                $
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={300}
                placeholder={chat.placeholder}
                aria-label="Ask a question about Satya"
                className="min-w-0 flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted/60"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="rounded-md bg-gradient-to-r from-accent to-accent-2 px-3 py-1.5 font-mono text-xs font-semibold text-[#04121c] transition-opacity disabled:opacity-40"
              >
                send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <button
        onClick={open ? close : start}
        aria-label={open ? "Close chat" : "Open chat assistant"}
        aria-expanded={open}
        aria-controls="chat-panel"
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-background/90 text-accent shadow-[0_0_28px_-6px_var(--glow)] backdrop-blur-md transition-transform hover:scale-105"
      >
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full border border-accent/40 [animation-duration:2.4s]" />
        )}
        {open ? <span className="font-mono text-lg">✕</span> : <RagIcon />}
        {!open && (
          <span className="absolute -left-1.5 -top-1.5 rounded-full border border-accent-2/50 bg-background px-1.5 py-px font-mono text-[9px] font-semibold tracking-wide text-accent-2">
            RAG
          </span>
        )}
      </button>
    </div>
  );
}

// Chat bubble holding a tiny knowledge graph — "chat over retrieved knowledge".
function RagIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true">
      <path
        d="M6 7.5A3.5 3.5 0 0 1 9.5 4h13A3.5 3.5 0 0 1 26 7.5v10a3.5 3.5 0 0 1-3.5 3.5H14l-5.5 5v-5A3.5 3.5 0 0 1 6 17.5v-10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M11 15.5 16 9l5 6.5H11"
        stroke="var(--accent-2)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="9" r="1.9" fill="currentColor" />
      <circle cx="11" cy="15.5" r="1.9" fill="currentColor" />
      <circle cx="21" cy="15.5" r="1.9" fill="currentColor" />
    </svg>
  );
}
