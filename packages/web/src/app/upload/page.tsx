"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { uploadSoul } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function UploadPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);

  const hasFile = fileName !== null;

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setContent(text);
      setFileName(file.name);
      setError("");
    };
    reader.readAsText(file);
  }, []);

  const clearFile = () => {
    setFileName(null);
    setContent("");
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  if (!isLoading && !user) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Login Required</h1>
        <p className="text-text-muted mb-6">
          You need to be logged in to upload a{" "}
          <code className="font-mono">
            <span className="text-accent">SOUL</span>.md
          </code>
          .
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
      const res = await uploadSoul(content);
      router.push(`/soul/${res.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Upload your{" "}
        <code className="font-mono">
          <span className="text-accent">SOUL</span>.md
        </code>
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-4 ${
            dragging
              ? "border-accent bg-accent/5"
              : hasFile
                ? "border-accent/50 bg-accent/5"
                : "border-border hover:border-text-muted"
          }`}
        >
          {hasFile ? (
            <div className="flex items-center justify-center gap-3">
              <span className="text-accent font-medium">{fileName}</span>
              <button
                type="button"
                onClick={clearFile}
                className="text-text-muted hover:text-text text-sm underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <p className="text-text-muted mb-1">
                Drag & drop a{" "}
                <code className="font-medium">
                  <span className="text-accent">SOUL</span>.md
                </code>{" "}
                file here (or any{" "}
                <code className="text-text font-medium">.md</code> file)
              </p>
              <p className="text-text-muted text-sm">
                or <span className="text-accent underline">browse files</span>
              </p>
              <input
                type="file"
                accept=".md,.soul.md"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-muted uppercase tracking-wide">
            or paste content
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Paste textarea */}
        <textarea
          value={hasFile ? content : content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your SOUL.md content here..."
          rows={12}
          disabled={hasFile}
          className={`w-full bg-bg-input border border-border rounded-lg px-4 py-3 placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors font-mono text-sm resize-y mb-4 ${
            hasFile
              ? "opacity-40 cursor-not-allowed text-text-muted"
              : "text-text"
          }`}
        />

        {error && <p className="text-error text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {submitting ? (
            <>
              Uploading <code className="font-mono">SOUL.md</code>...
            </>
          ) : (
            <>
              Upload <code className="font-mono">SOUL.md</code>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
