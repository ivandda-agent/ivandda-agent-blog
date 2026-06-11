import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { compile } from "@mdx-js/mdx";
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
  if (!post) return { title: "Not Found" };
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

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        ← Back to posts
      </Link>

      <header className="mt-8 mb-12">
        <time className="text-sm text-zinc-500 dark:text-zinc-400">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          {post.title}
        </h1>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-zinc-900 dark:prose-a:text-zinc-100 prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-zinc-950 dark:prose-pre:bg-zinc-900 prose-pre:text-zinc-100">
        <MDXContent />
      </div>
    </article>
  );
}
