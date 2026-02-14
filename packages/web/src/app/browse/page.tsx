"use client";

import { useEffect, useState, useCallback } from "react";
import { listSouls } from "@/lib/api";
import type { Soul, Pagination as PaginationType } from "@/lib/types";
import SoulCard from "@/components/SoulCard";
import Pagination from "@/components/Pagination";

export default function BrowsePage() {
  const [souls, setSouls] = useState<Soul[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("top");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchSouls = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listSouls({
        search: search || undefined,
        sort: sort === "recent" ? undefined : sort,
        page,
        limit: 12,
      });
      setSouls(res.data);
      setPagination(res.pagination);
    } finally {
      setLoading(false);
    }
  }, [search, sort, page]);

  useEffect(() => {
    fetchSouls();
  }, [fetchSouls]);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Browse <code className="font-mono"><span className="text-accent">SOUL</span>.md</code> files
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 bg-bg-input border border-border rounded-md px-4 py-2 text-text placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-bg-input border border-border rounded-md px-4 py-2 text-text focus:outline-none focus:border-accent transition-colors"
        >
          <option value="recent">Recent</option>
          <option value="top">Top Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-bg-card border border-border rounded-lg p-5 animate-pulse h-36"
            />
          ))}
        </div>
      ) : souls.length === 0 ? (
        <p className="text-text-muted text-center py-12">No results found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {souls.map((soul) => (
              <SoulCard key={soul.id} soul={soul} />
            ))}
          </div>
          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
