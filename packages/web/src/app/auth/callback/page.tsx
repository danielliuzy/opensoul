"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Suspense } from "react";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const username = searchParams.get("username");
    const avatar = searchParams.get("avatar");

    if (token && id && username && avatar) {
      login(token, {
        id: Number(id),
        username,
        avatar,
      });
      router.push("/");
    }
  }, [searchParams, router, login]);

  return (
    <div className="text-center py-16">
      <p className="text-text-muted">Signing you in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-16">
          <p className="text-text-muted">Loading...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
