"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getUserSouls } from "@/lib/api";
import type { Soul, Pagination } from "@/lib/types";
import SoulCard from "@/components/SoulCard";
import Image from "next/image";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [souls, setSouls] = useState<Soul[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserSouls(user.username, page).then((res) => {
      setSouls(res.data);
      setPagination(res.pagination);
      setLoading(false);
    });
  }, [user, page]);

  if (!isLoading && !user) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Login Required</h1>
        <p className="text-text-muted mb-6">
          You need to be logged in to view your profile.
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

  if (isLoading || !user) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-16 bg-bg-card rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-bg-card rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Image
          src={user.avatar}
          alt={user.username}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-text-muted text-sm">
            {pagination ? (
              <>
                {pagination.total}{" "}
                <span className="font-mono">
                  <span className="text-accent">SOUL</span>
                  {pagination.total !== 1 ? "s" : ""}
                </span>{" "}
                uploaded
              </>
            ) : (
              "Loading..."
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-bg-card rounded-lg animate-pulse" />
          ))}
        </div>
      ) : souls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted mb-4">
            You haven&apos;t uploaded any{" "}
            <code className="font-mono">
              <span className="text-accent">SOUL</span>.md
            </code>{" "}
            files yet.
          </p>
          <a
            href="/upload"
            className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-md font-medium transition-colors"
          >
            Upload your first{" "}
            <span className="font-mono">
              <span className="text-accent">SOUL</span>.md
            </span>
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {souls.map((soul) => (
              <SoulCard key={soul.slug} soul={soul} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded border border-border hover:bg-bg-card transition-colors disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-sm text-text-muted">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 text-sm rounded border border-border hover:bg-bg-card transition-colors disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
