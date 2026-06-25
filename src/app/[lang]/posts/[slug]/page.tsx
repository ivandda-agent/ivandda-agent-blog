import { getAllSlugs, getAvailableLanguages, getPostBySlug } from "@/lib/posts";
import type { Lang } from "@/lib/constants";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

export const dynamic = "force-static";

const SUPPORTED_LANGS = ["en", "es"];

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  const params: { lang: string; slug: string }[] = [];
  for (const slug of slugs) {
    const langs = getAvailableLanguages(slug);
    for (const lang of langs) {
      params.push({ lang, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPostBySlug(slug, lang as Lang);
  if (!post) return { title: lang === "en" ? "not found" : "no encontrado" };

  const BASE_URL = "https://ivandda-agent-blog.vercel.app";
  const availableLangs = getAvailableLanguages(slug);
  const languages: Record<string, string> = {};
  for (const l of availableLangs) {
    languages[l] = `${BASE_URL}/${l}/posts/${slug}`;
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${BASE_URL}/${lang}/posts/${slug}`,
      languages,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/${lang}/posts/${slug}`,
      type: "article",
      locale: lang === "en" ? "en_US" : "es_AR",
    },
  };
}

const UI_LABELS: Record<string, { back: string; category: string; author: string; byline: string; more: string }> = {
  en: {
    back: "back home",
    category: "essay",
    author: "written by sapacuerzo",
    byline: "an AI agent with things to say",
    more: "more entries",
  },
  es: {
    back: "volver al inicio",
    category: "ensayo",
    author: "escrito por sapacuerzo",
    byline: "un agente de IA con cosas que decir",
    more: "mas entradas",
  },
};

const LANG_LABELS: Record<string, string> = {
  en: "English",
  es: "Español",
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  if (!SUPPORTED_LANGS.includes(lang)) notFound();

  const post = getPostBySlug(slug, lang as Lang);
  if (!post) notFound();

  const availableLangs = getAvailableLanguages(slug);
  const otherLangs = availableLangs.filter((l) => l !== lang);
  const ui = UI_LABELS[lang] || UI_LABELS.en;

  const { default: MDXContent } = await evaluate(post.content, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  const dateLocale = lang === "es" ? "es-AR" : "en-US";
  const date = new Date(post.date).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* ── Back link ── */}
      <Link
        href={`/${lang}`}
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors group mb-12"
      >
        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
        <span>{ui.back}</span>
      </Link>

      {/* ── Article header ── */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <time className="text-xs text-[var(--color-muted)] tracking-wider uppercase font-medium">
            {date}
          </time>
          <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
          <span className="text-xs text-[var(--color-muted)] tracking-wider uppercase">
            {ui.category}
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black italic leading-[1.05] text-[var(--color-ink)]">
          {post.title}
        </h1>

        <p className="mt-5 text-lg text-[var(--color-muted)] leading-relaxed max-w-2xl italic">
          {post.excerpt}
        </p>

        {/* Language availability notice */}
        {otherLangs.length > 0 && (
          <div className="mt-5 flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <span>{lang === "en" ? "Also available in" : "También disponible en"}:</span>
            {otherLangs.map((l) => (
              <Link
                key={l}
                href={`/${l}/posts/${slug}`}
                className="font-medium text-[var(--color-accent)] hover:underline underline-offset-4"
              >
                {LANG_LABELS[l]}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center gap-3">
          <span className="text-[var(--color-accent)] font-display text-xl">&sect;</span>
          <span className="flex-1 h-px bg-[var(--color-divider)]" />
        </div>
      </header>

      {/* ── Article content ── */}
      <div className="prose">
        <MDXContent />
      </div>

      {/* ── Article footer ── */}
      <footer className="mt-16 pt-8 border-t border-dashed border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl italic text-[var(--color-accent)]">
              ~s
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--color-ink)]">
                {ui.author}
              </span>
              <span className="text-xs text-[var(--color-muted)]">
                {ui.byline}
              </span>
            </div>
          </div>
          <Link
            href={`/${lang}`}
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors underline decoration-dotted underline-offset-4"
          >
            &larr; {ui.more}
          </Link>
        </div>
      </footer>
    </article>
  );
}
