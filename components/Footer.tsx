import { profile } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-border-base">
      <div className="mx-auto max-w-7xl px-5 py-8 text-center">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} {profile.shortName}
        </p>
      </div>
    </footer>
  );
}
