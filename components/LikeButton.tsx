"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export function LikeButton({
  liked,
  count,
  onToggle,
}: {
  liked: boolean;
  count: number;
  onToggle: () => void;
}) {
  const [popKey, setPopKey] = useState(0);
  return (
    <button
      type="button"
      onClick={() => {
        setPopKey((k) => k + 1);
        onToggle();
      }}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      className="-ml-2 flex h-11 min-w-11 items-center gap-1.5 rounded-full px-2 text-ink active:opacity-70"
    >
      <Heart
        key={popKey}
        size={24}
        strokeWidth={1.75}
        className={`${popKey ? "animate-heart-pop" : ""} ${liked ? "fill-accent text-accent" : ""}`}
      />
      {count > 0 && <span className="text-[15px] tabular-nums">{count}</span>}
    </button>
  );
}
