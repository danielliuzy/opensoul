"use client";

import { getLoginUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { GithubIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  return (
    <div className="text-center py-16">
      <h1 className="text-2xl font-bold mb-4">
        Login to Open<span className="text-accent">SOUL</span>.md
      </h1>
      <p className="text-text-muted mb-8">
        Sign in with your GitHub account to upload and rate souls.
      </p>
      <a
        href={getLoginUrl()}
        className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-md font-medium transition-colors"
      >
        <GithubIcon />
        Login with GitHub
      </a>
    </div>
  );
}
