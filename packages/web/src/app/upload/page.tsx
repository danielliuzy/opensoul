"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadSoul } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function UploadPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [changelog, setChangelog] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!isLoading && !user) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Login Required</h1>
        <p className="text-text-muted mb-6">
          You need to be logged in to upload a soul.
        </p>
        <a
          href="/login"
          className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-md font-medium transition-colors"
        >
          Login with GitHub
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Content is required");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await uploadSoul(content, changelog || undefined);
      router.push(`/soul/${res.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Upload a Soul</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              !showPreview
                ? "bg-accent text-white"
                : "text-text-muted hover:text-text"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              showPreview
                ? "bg-accent text-white"
                : "text-text-muted hover:text-text"
            }`}
          >
            Preview
          </button>
        </div>

        {showPreview ? (
          <div className="bg-bg-card border border-border rounded-lg p-6 min-h-[400px] mb-4">
            {content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="text-text-muted">Nothing to preview</p>
            )}
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your SOUL.md content here..."
            rows={20}
            className="w-full bg-bg-input border border-border rounded-lg px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors font-mono text-sm resize-y mb-4"
          />
        )}

        <input
          type="text"
          value={changelog}
          onChange={(e) => setChangelog(e.target.value)}
          placeholder="Changelog (optional)"
          className="w-full bg-bg-input border border-border rounded-md px-4 py-2 text-text placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors mb-4"
        />

        {error && (
          <p className="text-error text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {submitting ? "Uploading..." : "Upload Soul"}
        </button>
      </form>
    </div>
  );
}
