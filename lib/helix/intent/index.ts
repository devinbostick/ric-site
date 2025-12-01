// lib/helix/intent/index.ts

import { buildWorldFromIntent } from "./buildWorldFromIntent";
export type { HelixWorldContext } from "../types";

/**
 * Single public entrypoint used by /api/helix-chat.
 *
 * message → intent + worldSummary + evidenceFacts + promptText
 * Deterministic: same message → same context.
 */
export function buildHelixContext(message: string) {
  return buildWorldFromIntent(message);
}
