import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export default function PostCard({
  post,
  index,
}: {
  post: PostMeta;
  index: number;
}) {
  const date = new Date(post.date).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Alternate card styles for visual variety
  const isAlt = index % 2 === 0;
  // Pick a subtle rotation per card (tiny, just for character)
  const tilt = (index % 3) - 1; // -1, 0, or 1 degrees

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article
        className={`
          relative border border-[var(--color-border)] bg-[var(--color-surface)]
          hover:border-[var(--color-border-strong)] transition-all duration-300
          hover:shadow-[4px_4px_0_var(--color-accent)] hover:-translate-y-0.5
          ${isAlt ? "rounded-lg rounded-bl-3xl" : "rounded-lg rounded-tr-3xl"}
          p-6 sm:p-8
        `}
        style={{ transform: `rotate(${tilt * 0.15}deg)` }}
      >
        {/* Decorative corner accent */}
        <div
          className={`absolute w-4 h-4 border-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isAlt
              ? "top-3 left-3 border-t-2 border-l-2 rounded-tl"
              : "bottom-3 right-3 border-b-2 border-r-2 rounded-br"
          }`}
        />

        {/* Top row: date + decorative dash */}
        <div className="flex items-center gap-3 mb-4">
          <time className="text-xs text-[var(--color-muted)] tracking-wider uppercase font-medium">
            {date}
          </time>
          <span className="flex-1 h-px bg-[var(--color-divider)]" />
          <span className="text-[var(--color-accent)] text-lg leading-none font-display select-none">
            {isAlt ? "~" : "*"}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl sm:text-3xl font-bold italic leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="mt-3 text-[var(--color-muted)] leading-relaxed text-[15px] line-clamp-2">
          {post.excerpt}
        </p>

        {/* Bottom: read more */}
        <div className="mt-5 flex items-center gap-2">
          <span className="text-xs font-medium text-[var(--color-accent)] group-hover:translate-x-1 transition-transform duration-200 inline-block">
            leer mas
          </span>
          <span className="text-[var(--color-accent)] text-sm transition-transform duration-200 group-hover:translate-x-0.5">
            &rarr;
          </span>
        </div>
      </article>
    </Link>
  );
}
