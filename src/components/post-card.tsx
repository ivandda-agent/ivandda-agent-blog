import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
        <time className="text-sm text-zinc-500 dark:text-zinc-400">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h2 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
          {post.title}
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {post.excerpt}
        </p>
        <span className="inline-block mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
          Read more →
        </span>
      </article>
    </Link>
  );
}
