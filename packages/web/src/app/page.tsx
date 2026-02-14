"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listSouls } from "@/lib/api";
import type { Soul } from "@/lib/types";
import SoulCard from "@/components/SoulCard";

export default function HomePage() {
  const installers = [
    { label: "npm", command: "npm install -g soulmd" },
    { label: "pnpm", command: "pnpm add -g soulmd" },
    { label: "yarn", command: "yarn global add soulmd" },
    { label: "bun", command: "bun add -g soulmd" },
  ];
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const [topSouls, setTopSouls] = useState<Soul[]>([]);
  const [recentSouls, setRecentSouls] = useState<Soul[]>([]);

  useEffect(() => {
    listSouls({ sort: "top", limit: 6 }).then((res) => setTopSouls(res.data));
    listSouls({ limit: 6 }).then((res) => setRecentSouls(res.data));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          The Registry for{" "}
          <span className="text-accent">AI Souls</span>
        </h1>
        <p className="text-text-muted text-lg max-w-xl mx-auto mb-8">
          Discover, share, and rate SOUL.md personality definitions that shape
          how AI assistants think and behave.
        </p>
        <div className="flex items-center justify-center gap-4 mb-8">
          <Link
            href="/browse"
            className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-md font-medium transition-colors"
          >
            Browse Souls
          </Link>
          <Link
            href="/upload"
            className="border border-border text-text hover:bg-bg-hover px-6 py-2.5 rounded-md font-medium transition-colors"
          >
            Upload a Soul
          </Link>
        </div>
        <div className="inline-flex flex-col items-center gap-0">
          <div className="flex">
            {installers.map((inst, i) => (
              <button
                key={inst.label}
                onClick={() => { setSelected(i); setCopied(false); }}
                className={`text-xs px-3 py-1.5 transition-colors ${
                  i === selected
                    ? "bg-bg-card border border-border border-b-transparent text-text rounded-t-md"
                    : "text-text-muted hover:text-text border border-transparent border-b-border"
                }`}
              >
                {inst.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(installers[selected].command);
              setCopied(true);
            }}
            className="group inline-flex items-center gap-3 bg-bg-card border border-border rounded-b-lg rounded-tr-lg px-5 py-3 hover:border-accent/50 transition-colors cursor-pointer"
          >
            <span className="text-success text-sm">$</span>
            <code className="text-sm text-text font-mono">{installers[selected].command}</code>
            <span className="text-xs text-text-muted group-hover:text-text transition-colors ml-1">
              {copied ? "Copied!" : "Click to copy"}
            </span>
          </button>
        </div>
      </section>

      {/* Top Rated */}
      {topSouls.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Top Rated</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topSouls.map((soul) => (
              <SoulCard key={soul.id} soul={soul} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Added */}
      {recentSouls.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Recently Added</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSouls.map((soul) => (
              <SoulCard key={soul.id} soul={soul} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
