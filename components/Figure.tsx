export default function Figure({ src, alt, caption }:{src:string;alt?:string;caption?:string}) {
  return (
    <figure className="not-prose my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt || ""} className="w-full rounded-xl ring-1 ring-black/5" />
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-neutral-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
