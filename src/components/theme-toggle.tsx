"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "modo claro" : "modo oscuro"}
      className="relative w-12 h-6 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] transition-all duration-300 group"
    >
      {/* Track decoration */}
      <span className="absolute inset-0 rounded-full overflow-hidden">
        <span
          className={`absolute inset-0 transition-opacity duration-500 ${
            dark ? "opacity-30" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle at 75% 50%, var(--color-accent) 0%, transparent 60%)",
          }}
        />
      </span>

      {/* Thumb */}
      <span
        className={`
          absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300
          flex items-center justify-center text-[10px]
          ${
            dark
              ? "left-[calc(100%-1.375rem)] bg-[var(--color-ink)] text-[var(--color-paper)]"
              : "left-0.5 bg-[var(--color-gold)] text-[var(--color-ink)]"
          }
        `}
      >
        {dark ? (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" />
          </svg>
        )}
      </span>
    </button>
  );
}
