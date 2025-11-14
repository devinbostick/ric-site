import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/app/mdx-components";
import type { ComponentType } from "react";

type ComponentsMap = Record<string, ComponentType<unknown>>;

type FrontMatter = {
  title: string;
  date?: string;
  summary?: string;
  tags?: string[];
};

function coerceFrontMatter(data: unknown): FrontMatter {
  const d = (data ?? {}) as Record<string, unknown>;
  const title = typeof d.title === "string" && d.title.trim() ? d.title : "Untitled";
  const date = typeof d.date === "string" ? d.date : undefined;
  const summary = typeof d.summary === "string" ? d.summary : undefined;
  const tags =
    Array.isArray(d.tags) && d.tags.every((t) => typeof t === "string")
      ? (d.tags as string[])
      : [];
  return { title, date, summary, tags };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const p = path.join(process.cwd(), "content", "posts", `${params.slug}.mdx`);
  const file = await fs.promises.readFile(p, "utf8");
  const { content, data } = matter(file);
  const meta = coerceFrontMatter(data);

  return (
    <article className="prose lg:prose-xl dark:prose-invert mx-auto">
      <h1 className="mt-2 mb-3">{meta.title}</h1>
      {(meta.date || meta.summary) && (
        <p className="mt-0 mb-1 text-sm text-neutral-500">
          {meta.date}{meta.summary ? ` — ${meta.summary}` : ""}
        </p>
      )}
      {meta.tags.length > 0 && (
        <p className="m-0 text-xs text-neutral-400">{meta.tags.join(" · ")}</p>
      )}
      <hr className="my-6" />
      <MDXRemote source={content} components={mdxComponents as unknown as ComponentsMap} />
    </article>
  );
}
