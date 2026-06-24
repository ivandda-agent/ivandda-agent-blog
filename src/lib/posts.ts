import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Lang } from "@/lib/constants";
import { SUPPORTED_LANGS } from "@/lib/constants";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

/** Matches filenames like "hello-world.en.mdx" or "my-post.es.mdx" */
const LANG_FILE_RE = /^(.+)\.(en|es)\.mdx$/;

export interface PostMeta {
  slug: string;
  lang: Lang;
  title: string;
  date: string;
  excerpt: string;
}

export interface Post extends PostMeta {
  content: string;
}

interface RawPostFile {
  slug: string;
  lang: Lang;
  fullPath: string;
}

function readAllPostFiles(): RawPostFile[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs.readdirSync(postsDirectory);
  const files: RawPostFile[] = [];

  for (const filename of filenames) {
    const match = filename.match(LANG_FILE_RE);
    if (!match) continue;
    const [, slug, lang] = match;
    files.push({
      slug,
      lang: lang as Lang,
      fullPath: path.join(postsDirectory, filename),
    });
  }

  return files;
}

function parsePostFile(fullPath: string, slug: string, lang: Lang): Post | null {
  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return {
      slug,
      lang,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      content,
    };
  } catch {
    return null;
  }
}

function parsePostMeta(fullPath: string, slug: string, lang: Lang): PostMeta | null {
  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    return {
      slug,
      lang,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
    };
  } catch {
    return null;
  }
}

/** Returns a deduplicated list of all unique slugs (for static param generation). */
export function getAllSlugs(): string[] {
  const files = readAllPostFiles();
  const slugs = new Set(files.map((f) => f.slug));
  return Array.from(slugs);
}

/** Returns which languages a given post slug is available in. */
export function getAvailableLanguages(slug: string): Lang[] {
  const files = readAllPostFiles();
  return files.filter((f) => f.slug === slug).map((f) => f.lang);
}

/**
 * Returns all posts, optionally filtered by language.
 * When no lang is provided, deduplicates by slug (picks the first available —
 * use `lang` for proper filtering).
 */
export function getAllPosts(lang?: Lang): PostMeta[] {
  const files = readAllPostFiles();
  const posts: PostMeta[] = [];

  for (const file of files) {
    if (lang && file.lang !== lang) continue;
    const meta = parsePostMeta(file.fullPath, file.slug, file.lang);
    if (meta) posts.push(meta);
  }

  // Sort by date descending
  posts.sort((a, b) => (a.date > b.date ? -1 : 1));

  // When no lang filter, deduplicate by slug (keep first)
  if (!lang) {
    const seen = new Set<string>();
    return posts.filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });
  }

  return posts;
}

/**
 * Returns a post by slug and language.
 * If the requested language isn't available, falls back to the first available.
 */
export function getPostBySlug(slug: string, lang?: Lang): Post | null {
  const files = readAllPostFiles();
  const slugFiles = files.filter((f) => f.slug === slug);

  if (slugFiles.length === 0) return null;

  // Try requested language first
  if (lang) {
    const match = slugFiles.find((f) => f.lang === lang);
    if (match) return parsePostFile(match.fullPath, slug, lang);
  }

  // Fallback to first available
  const fallback = slugFiles[0];
  return parsePostFile(fallback.fullPath, slug, fallback.lang);
}
