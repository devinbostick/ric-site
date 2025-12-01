// lib/helix/explain/explainBundle.ts

export type PasSummary =
  | {
      current?: number | null;
      delta?: number | null;
      driftStatus?: string | null;
    }
  | null;

export type BundleSummary =
  | {
      title: string;
      lines: string[];
    }
  | null;

/**
 * Extract PAS_h + drift summary from a raw AGI legality block.
 */
function extractPasSummary(legality: any): PasSummary {
  if (!legality || typeof legality !== "object") return null;
  const drift = legality.identityDrift;
  if (!drift || typeof drift !== "object") return null;

  const current =
    typeof drift.pasCurrent === "number"
      ? drift.pasCurrent
      : typeof drift.pasCurrent === "string"
      ? Number(drift.pasCurrent)
      : null;

  const delta =
    typeof drift.delta === "number"
      ? drift.delta
      : typeof drift.delta === "string"
      ? Number(drift.delta)
      : null;

  const driftStatus =
    typeof drift.verdict === "string" ? drift.verdict : null;

  return { current, delta, driftStatus };
}

/**
 * Turn a raw /agi/run result into a bundle summary and legality note.
 */
export function summarizeBundleFromAgi(result: any): {
  pasSummary: PasSummary;
  bundleSummary: BundleSummary;
  bundleHash: string | null;
  agiError: string | null;
} {
  const legality = result?.legality ?? null;
  const pasSummary = extractPasSummary(legality);

  const bundleHash =
    typeof result?.bundleHash === "string" ? result.bundleHash : null;
  const version =
    typeof result?.version === "string" ? result.version : "";
  const identityId =
    typeof result?.identity?.id === "string"
      ? result.identity.id
      : "helix-core";
  const chosenAction =
    typeof result?.chosenActionName === "string"
      ? result.chosenActionName
      : typeof result?.chosenActionId === "string"
      ? result.chosenActionId
      : "";

  const lines: string[] = [];
  if (version) lines.push(`version: ${version}`);
  if (bundleHash) lines.push(`bundleHash: ${bundleHash}`);
  if (identityId) lines.push(`identity: ${identityId}`);
  if (chosenAction) lines.push(`chosenAction: ${chosenAction}`);

  const bundleSummary: BundleSummary =
    lines.length > 0
      ? {
          title: "AGI proof bundle summary",
          lines,
        }
      : null;

  let agiError: string | null = null;
  if (legality && legality.valid === false) {
    const codes =
      Array.isArray(legality.violations) && legality.violations.length > 0
        ? legality.violations
            .map((v: any) =>
              typeof v?.code === "string" ? v.code : "UNKNOWN",
            )
            .join(", ")
        : null;
    agiError = codes
      ? `AGI legality violations: ${codes}`
      : "AGI legality marked invalid for this run.";
  }

  return { pasSummary, bundleSummary, bundleHash, agiError };
}