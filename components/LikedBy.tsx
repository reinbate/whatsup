"use client";

import { namesSummary } from "@/lib/format";
import { ME_ID } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { Avatar } from "./Avatar";

// "Maya, Sam and 2 others" with small overlapping faces. Names, not a big number.
export function LikedBy({ likes }: { likes: string[] }) {
  const { userById } = useStore();
  if (likes.length === 0) return null;
  // Show yourself first as "You".
  const ordered = [...likes].sort((a, b) => (a === ME_ID ? -1 : b === ME_ID ? 1 : 0));
  const names = ordered.map((id) => (id === ME_ID ? "You" : userById(id).name));
  return (
    <div className="flex items-center gap-2 text-[14px] text-muted">
      <div className="flex -space-x-1.5">
        {ordered.slice(0, 3).map((id) => (
          <Avatar key={id} user={userById(id)} size={20} ring />
        ))}
      </div>
      <span>
        Liked by <span className="text-ink">{namesSummary(names)}</span>
      </span>
    </div>
  );
}
