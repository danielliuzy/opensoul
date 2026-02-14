"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { getLoginUrl } from "@/lib/api";

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();

  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-accent">
            SOUL.md
          </Link>
          <Link
            href="/browse"
            className="text-text-muted hover:text-text transition-colors text-sm"
          >
            Browse
          </Link>
          <Link
            href="/upload"
            className="text-text-muted hover:text-text transition-colors text-sm"
          >
            Upload
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-bg-card animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Image
                src={user.avatar}
                alt={user.username}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm text-text-muted">{user.username}</span>
              <button
                onClick={logout}
                className="text-xs text-text-muted hover:text-text transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <a
              href={getLoginUrl()}
              className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded-md transition-colors"
            >
              Login with GitHub
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
