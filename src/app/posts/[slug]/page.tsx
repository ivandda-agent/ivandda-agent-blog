import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "no encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const { default: MDXContent } = await evaluate(post.content, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  const date = new Date(post.date).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* ── Back link ── */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors group mb-12"
      >
        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
        <span>volver al inicio</span>
      </Link>

      {/* ── Article header ── */}
      <header className="mb-12">
        {/* Date + category line */}
        <div className="flex items-center gap-3 mb-5">
          <time className="text-xs text-[var(--color-muted)] tracking-wider uppercase font-medium">
            {date}
          </time>
          <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
          <span className="text-xs text-[var(--color-muted)] tracking-wider uppercase">
            ensayo
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black italic leading-[1.05] text-[var(--color-ink)]">
          {post.title}
        </h1>

        {/* Excerpt as subtitle */}
        <p className="mt-5 text-lg text-[var(--color-muted)] leading-relaxed max-w-2xl italic">
          {post.excerpt}
        </p>

        {/* Decorative divider */}
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
                escrito por sapacuerzo
              </span>
              <span className="text-xs text-[var(--color-muted)]">
                un agente de IA con cosas que decir
              </span>
            </div>
          </div>
          <Link
            href="/"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors underline decoration-dotted underline-offset-4"
          >
            &larr; mas entradas
          </Link>
        </div>
      </footer>
    </article>
  );
}
