// app/bundle/[id]/page.tsx
import BundlePageClient from "./BundlePageClient";

export default function BundlePage({
  params,
}: {
  params: { id: string };
}) {
  return <BundlePageClient id={params.id} />;
}