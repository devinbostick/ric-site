// app/agi/HelixChat.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

type HelixChatMessage = {
    role: "user" | "system";
    text: string;
};

type HelixFact = {
    id: string;
    category: string;
    key: string;
    value: string;
    tags?: string[];
};

type PasSummary = {
    current?: number | null;
    delta?: number | null;
    driftStatus?: string | null;
} | null;

type BundleSummary = {
    title: string;
    lines: string[];
};

type HelixEvidence = {
    worldSummary: string;
    evidenceFacts: HelixFact[];
    pasSummary: PasSummary;
    bundleSummary: BundleSummary | null;
    bundleId: string | null;
    agiError: string | null;
};

export default function HelixChat() {
    const [messages, setMessages] = useState<HelixChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [evidence, setEvidence] = useState<HelixEvidence | null>(null);

    async function send() {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const nextMessages: HelixChatMessage[] = [
            ...messages,
            { role: "user", text: trimmed },
        ];
        setMessages(nextMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/helix-chat", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ message: trimmed }),
            });

            if (!res.ok) {
                const body = await res.text();
                setMessages([
                    ...nextMessages,
                    {
                        role: "system",
                        text: `Helix mind error: HTTP ${res.status} — ${body.slice(
                            0,
                            200,
                        )}`,
                    },
                ]);
                setEvidence(null);
                return;
            }

            const json = await res.json();

            const answerText: string =
                json?.answer?.answer ??
                "Helix mind responded, but no answer payload was found.";

            const bullets: string[] = json?.answer?.bullets ?? [];
            const bulletText =
                bullets.length > 0 ? "\n\n" + bullets.join("\n") : "";

            const systemMessage: HelixChatMessage = {
                role: "system",
                text: answerText + bulletText,
            };

            setMessages([...nextMessages, systemMessage]);

            const evidenceFacts: HelixFact[] = json?.answer?.evidenceFacts ?? [];
            const worldSummary: string = json?.worldSummary ?? "";
            const pasSummary: PasSummary = json?.pasSummary ?? null;
            const bundleSummary: BundleSummary | null =
                json?.bundleSummary ?? null;
            const agiError: string | null = json?.agiError ?? null;

            const bundleId: string | null =
                typeof json?.agi?.bundleHash === "string"
                    ? json.agi.bundleHash
                    : null;

            setEvidence({
                worldSummary,
                evidenceFacts,
                pasSummary,
                bundleSummary,
                bundleId,
                agiError,
            });
        } catch (err: any) {
            setMessages([
                ...nextMessages,
                {
                    role: "system",
                    text: `Helix mind error: ${err?.message ?? String(err)}`,
                },
            ]);
            setEvidence(null);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-xs text-neutral-800 shadow-sm sm:p-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Helix deterministic mind
                    </p>
                    <p className="text-xs text-neutral-700">
                        Ask about Helix&apos;s business, strategy, fleet, or incidents.
                        Every answer is built from a deterministic knowledge base and an
                        /agi/run proof.
                    </p>
                </div>
            </div>

            {/* Chat transcript */}
            <div className="flex-1 space-y-2 overflow-auto rounded-xl border border-neutral-100 bg-neutral-50 p-3 max-h-80">
                {messages.length === 0 && (
                    <p className="text-[11px] text-neutral-500">
                        Try: <span className="font-mono">"Tell me about Helix"</span> or{" "}
                        <span className="font-mono">"What is Helix&apos;s strategy?"</span>
                    </p>
                )}
                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        className={
                            "whitespace-pre-wrap rounded-lg px-2 py-1.5 " +
                            (m.role === "user"
                                ? "bg-neutral-900 text-[11px] font-medium text-white"
                                : "bg-white text-[11px] text-neutral-800 border border-neutral-200")
                        }
                    >
                        {m.text}
                    </div>
                ))}
            </div>

            {/* Input */}
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
                placeholder="Ask Helix a question about its business, system state, or incidents..."
                className="w-full rounded-2xl border border-[#1694ff] bg-[#050816] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#1694ff] focus:border-[#1694ff]"
            />
            <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className={
                    "rounded-full px-3 py-2 text-xs font-semibold " +
                    (loading || !input.trim()
                        ? "bg-neutral-200 text-neutral-500"
                        : "bg-neutral-900 text-white hover:bg-black")
                }
            >
                {loading ? "Thinking…" : "Send"}
            </button>
        </div>

            {/* Evidence / receipts */ }
    {
        evidence && (
            <div className="mt-1 grid gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-3 text-[11px] text-neutral-700 md:grid-cols-3">
                {/* World summary + facts */}
                <section className="space-y-1 md:col-span-1">
                    <h3 className="text-[11px] font-semibold text-neutral-900">
                        World summary
                    </h3>
                    {evidence.worldSummary && (
                        <p className="text-[11px] text-neutral-700">
                            {evidence.worldSummary}
                        </p>
                    )}
                    {evidence.evidenceFacts.length > 0 && (
                        <div className="mt-2 space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                                Key facts
                            </p>
                            <ul className="space-y-0.5">
                                {evidence.evidenceFacts.slice(0, 6).map((f) => (
                                    <li key={f.id} className="text-[11px] leading-snug">
                                        <span className="font-mono text-[10px] text-neutral-500">
                                            {f.category}.{f.key}
                                        </span>
                                        : {f.value}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                {/* PAS_h / drift */}
                <section className="space-y-1 md:col-span-1">
                    <h3 className="text-[11px] font-semibold text-neutral-900">
                        PAS_h &amp; drift
                    </h3>
                    {evidence.pasSummary ? (
                        <div className="space-y-0.5">
                            {typeof evidence.pasSummary.current === "number" && (
                                <p>
                                    PAS_h (current):{" "}
                                    <span className="font-mono">
                                        {evidence.pasSummary.current}
                                    </span>
                                </p>
                            )}
                            {typeof evidence.pasSummary.delta === "number" && (
                                <p>
                                    ΔPAS_zeta:{" "}
                                    <span className="font-mono">
                                        {evidence.pasSummary.delta}
                                    </span>
                                </p>
                            )}
                            {evidence.pasSummary.driftStatus && (
                                <p>
                                    Drift status:{" "}
                                    <span className="font-mono uppercase">
                                        {evidence.pasSummary.driftStatus}
                                    </span>
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-[11px] text-neutral-500">
                            No PAS_h / drift summary was returned for this run.
                        </p>
                    )}
                    {evidence.agiError && (
                        <p className="mt-1 text-[10px] text-red-600">
                            AGI engine note: {evidence.agiError}
                        </p>
                    )}
                </section>

                {/* Proof bundle */}
                <section className="space-y-1 md:col-span-1">
                    <h3 className="text-[11px] font-semibold text-neutral-900">
                        Proof bundle
                    </h3>
                    {evidence.bundleSummary ? (
                        <>
                            <p className="text-[11px] text-neutral-700">
                                {evidence.bundleSummary.title}
                            </p>
                            <ul className="mt-1 space-y-0.5">
                                {evidence.bundleSummary.lines.map((line, idx) => (
                                    <li
                                        key={idx}
                                        className="font-mono text-[10px] leading-snug text-neutral-600"
                                    >
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="text-[11px] text-neutral-500">
                            No bundle metadata returned for this run.
                        </p>
                    )}

                    {evidence.bundleId && (
                        <div className="mt-2">
                            <Link
                                href={`/bundle/${encodeURIComponent(evidence.bundleId)}`}
                                className="inline-flex items-center rounded-full border border-neutral-800 px-3 py-1 text-[11px] font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
                            >
                                Open proof bundle
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        )
    }
        </div >
    );
}