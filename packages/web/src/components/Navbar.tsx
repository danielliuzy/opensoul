"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { getLoginUrl } from "@/lib/api";
import { Sun, Moon, LogOut, Github, Home } from "lucide-react";

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold font-serif hidden sm:block">
            Open<span className="text-accent">SOUL</span>.md
          </Link>
          <Link
            href="/"
            className="text-text-muted hover:text-text transition-colors sm:hidden"
            title="Home"
          >
            <Home size={18} />
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
          <button
            onClick={toggle}
            className="text-text-muted hover:text-text transition-colors p-1.5 rounded-md hover:bg-bg-hover"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-bg-card animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href={`/user/${user.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Image
                  src={user.avatar}
                  alt={user.username}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm text-text-muted hidden sm:inline">{user.username}</span>
              </Link>
              <button
                onClick={logout}
                className="text-text-muted hover:text-text transition-colors p-1.5 rounded-md hover:bg-bg-hover"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <a
              href={getLoginUrl()}
              className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-md transition-colors"
            >
              <Github size={16} />
              <span className="hidden sm:inline">Login</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
