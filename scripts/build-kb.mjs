// Embeds the résumé chunks from lib/chat-kb.ts with Gemini and writes worker/src/kb.json — the
// knowledge base the chat Worker retrieves from. Re-run after editing lib/content.ts.
// Usage: npm run kb   (needs GEMINI_API_KEY in the environment or .env.local)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tsRequire from "./ts-require.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EMBED_MODEL = "gemini-embedding-001";
const DIMENSIONS = 768;
const OUT = path.join(root, "worker", "src", "kb.json");

function apiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const envFile = path.join(root, ".env.local");
  const match = existsSync(envFile) && readFileSync(envFile, "utf8").match(/^GEMINI_API_KEY=(.+)$/m);
  if (match) return match[1].trim();
  throw new Error("GEMINI_API_KEY is missing — set it in the environment or .env.local.");
}

// Reduced-dimension Gemini embeddings aren't unit length; normalising here lets the Worker rank by dot product.
function unit(values) {
  const norm = Math.hypot(...values);
  return values.map((x) => Number((x / norm).toFixed(6)));
}

const { knowledge } = tsRequire(path.join(root, "lib", "chat-kb.ts"));

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:batchEmbedContents`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey() },
    body: JSON.stringify({
      requests: knowledge.map((k) => ({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text: k.context }] },
        taskType: "RETRIEVAL_DOCUMENT",
        title: k.title,
        outputDimensionality: DIMENSIONS,
      })),
    }),
  },
);
if (!res.ok) throw new Error(`Gemini embedding failed (${res.status}): ${await res.text()}`);
const { embeddings } = await res.json();

const kb = {
  model: EMBED_MODEL,
  dimensions: DIMENSIONS,
  chunks: knowledge.map((k, i) => ({
    id: k.id,
    title: k.title,
    context: k.context,
    vector: unit(embeddings[i].values),
  })),
};

writeFileSync(OUT, `${JSON.stringify(kb)}\n`);
console.log(`Embedded ${kb.chunks.length} chunks → ${path.relative(root, OUT)}`);
