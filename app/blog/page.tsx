import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

type PostMeta = {
  title: string;
  date?: string;
  summary?: string;
  tags?: string[];
  slug: string;
};

export default async function Page() {
  const dir = path.join(process.cwd(), "content", "posts");
  const files = (await fs.promises.readdir(dir).catch(() => []))
    .filter((f) => f.endsWith(".mdx"));

  const posts: PostMeta[] = await Promise.all(
    files.map(async (file) => {
      const p = path.join(dir, file);
      const src = await fs.promises.readFile(p, "utf8");
      const { data } = matter(src);
      const meta = data as Partial<PostMeta>;
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: meta.title ?? "Untitled",
        date: meta.date,
        summary: meta.summary,
        tags: Array.isArray(meta.tags) ? meta.tags : [],
      };
    })
  );

  const sorted = posts.sort(
    (a, b) => (b.date ?? "").localeCompare(a.date ?? "")
  );

  return (
    <section className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-4xl font-bold tracking-tight mb-6">Blog</h1>
      <div className="grid gap-4">
        {sorted.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="block rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <h2 className="text-2xl font-semibold">{p.title}</h2>
            {p.date && <p className="text-sm text-neutral-500 mt-1">{p.date}</p>}
            {p.summary && (
              <p className="text-neutral-600 dark:text-neutral-300 mt-3">
                {p.summary}
              </p>
            )}
            {p.tags.length > 0 && (
              <p className="mt-2 text-xs text-neutral-500">
                {p.tags.join(" · ")}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
