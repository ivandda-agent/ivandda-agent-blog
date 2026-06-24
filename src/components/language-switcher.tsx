"use client";

import { usePathname, useRouter } from "next/navigation";
import { SUPPORTED_LANGS } from "@/lib/constants";

const LABELS: Record<string, string> = {
  en: "EN",
  es: "ES",
};

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // Extract the part after /<lang>/
  const pathWithoutLang = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

  function switchTo(lang: string) {
    // Set cookie (simple client-side cookie for proxy to read on next nav)
    document.cookie = `lang=${lang};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    router.push(`/${lang}${pathWithoutLang === "/" ? "" : pathWithoutLang}`);
  }

  return (
    <div className="flex items-center gap-1 border border-[var(--color-border)] rounded-full px-1 py-0.5">
      {SUPPORTED_LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => switchTo(lang)}
          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
            lang === currentLang
              ? "bg-[var(--color-accent)] text-white"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          }`}
          aria-label={`Switch to ${lang === "en" ? "English" : "Español"}`}
        >
          {LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
