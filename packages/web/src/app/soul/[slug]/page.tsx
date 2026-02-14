"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSoul, getSoulContent, rateSoul } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { SoulDetailResponse } from "@/lib/types";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import StarRating from "@/components/StarRating";

export default function SoulDetailPage() {
  const params = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [soul, setSoul] = useState<SoulDetailResponse | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    getSoul(params.slug).then(setSoul);
    getSoulContent(params.slug).then(setContent);
  }, [params.slug]);

  const handleRate = async (rating: number) => {
    if (!user || ratingLoading) return;
    setRatingLoading(true);
    try {
      const res = await rateSoul(params.slug, rating);
      setSoul((prev) =>
        prev
          ? { ...prev, rating_avg: res.rating_avg, rating_count: res.rating_count }
          : prev
      );
    } finally {
      setRatingLoading(false);
    }
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!soul) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-bg-card rounded w-1/3" />
        <div className="h-64 bg-bg-card rounded" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {content ? (
            <MarkdownRenderer content={content} onCopy={handleCopy} copied={copied} />
          ) : (
            <div className="h-64 bg-bg-card rounded animate-pulse" />
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0">
          <div className="bg-bg-card border border-border rounded-lg p-5 space-y-4 sticky top-20">
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wide">
                Author
              </span>
              <p className="text-text font-medium">{soul.author}</p>
            </div>
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wide">
                Version
              </span>
              <p className="text-text font-mono">{soul.version}</p>
            </div>
            {soul.tags.length > 0 && (
              <div>
                <span className="text-xs text-text-muted uppercase tracking-wide">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {soul.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wide">
                Rating
              </span>
              <div className="flex items-center gap-2 mt-1">
                <StarRating
                  value={Math.round(soul.rating_avg)}
                  onChange={user ? handleRate : undefined}
                  readonly={!user}
                />
                <span className="text-sm text-text-muted">
                  {soul.rating_avg > 0 ? soul.rating_avg.toFixed(1) : "—"}
                  {soul.rating_count > 0 && ` (${soul.rating_count})`}
                </span>
              </div>
              {!user && (
                <p className="text-xs text-text-muted mt-1">
                  Login to rate this soul
                </p>
              )}
            </div>
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wide">
                Install via CLI
              </span>
              <code className="block text-sm bg-bg-input border border-border rounded px-3 py-2 mt-1 text-accent">
                soul pull {soul.slug}
              </code>
            </div>
            <div className="text-xs text-text-muted space-y-1">
              <p>Created: {new Date(soul.created_at).toLocaleDateString()}</p>
              <p>Updated: {new Date(soul.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Version History */}
      {soul.versions.data.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Version History</h2>
          <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-left">
                  <th className="px-4 py-3 font-medium">Version</th>
                  <th className="px-4 py-3 font-medium">Changelog</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {soul.versions.data.map((v) => (
                  <tr key={v.version} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-accent">
                      {v.version}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {v.changelog ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(v.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
