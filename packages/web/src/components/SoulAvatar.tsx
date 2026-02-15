"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getSoulImageUrl } from "@/lib/api";

interface SoulAvatarProps {
  soul: { slug: string; image_url: string | null; name: string };
  size?: number;
  className?: string;
  version?: number;
}

export default function SoulAvatar({ soul, size = 64, className = "", version }: SoulAvatarProps) {
  const [error, setError] = useState(false);

  useEffect(() => { setError(false); }, [version, soul.image_url]);

  if (!soul.image_url || error) {
    const letter = soul.name.charAt(0).toUpperCase() || "?";
    return (
      <div
        className={`shrink-0 rounded-full bg-accent/15 text-accent font-bold flex items-center justify-center select-none ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {letter}
      </div>
    );
  }

  return (
    <Image
      src={`${getSoulImageUrl(soul.slug)}?v=${encodeURIComponent(soul.image_url)}${version ? `&t=${version}` : ""}`}
      alt={soul.name}
      width={size}
      height={size}
      onError={() => setError(true)}
      className={`shrink-0 rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
