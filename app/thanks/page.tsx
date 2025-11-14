import Link from "next/link";
export default function Thanks() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-2">Thanks — you’re on the list.</h1>
      <p className="text-neutral-600 dark:text-neutral-300">We’ll let you know when we launch.</p>
      <p className="mt-8"><Link href="/" className="underline">Back to home</Link></p>
    </section>
  );
}
