"use client";

import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Hanko } from "@/components/Hanko";
import { InstallHelperCard } from "@/components/InstallHelper";
import { PostCard } from "@/components/PostCard";
import { PostSkeleton } from "@/components/Skeleton";
import { BrandBar } from "@/components/TopBar";
import { useStore } from "@/lib/store";

// Shows the loading placeholders once per visit, so they can be seen in the mockup.
let shownSkeleton = false;

export default function FeedPage() {
  return (
    <AppShell>
      <BrandBar />
      <Feed />
    </AppShell>
  );
}

function Feed() {
  const { posts, pending, showPending } = useStore();
  // Skip the placeholder if you just shared something, so your post shows straight away.
  const [loading, setLoading] = useState(() => !shownSkeleton && !posts.some((p) => p.uploading));

  useEffect(() => {
    if (!loading) {
      shownSkeleton = true;
      return;
    }
    const t = setTimeout(() => {
      shownSkeleton = true;
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <>
      {pending.length > 0 && (
        <div className="pointer-events-none sticky top-[calc(64px+env(safe-area-inset-top))] z-20 flex justify-center md:top-4">
          <button
            type="button"
            onClick={() => {
              showPending();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="animate-slide-up pointer-events-auto flex h-10 items-center gap-1.5 rounded-full bg-accent-2 px-4 text-[14px] font-semibold text-white shadow-soft"
          >
            <ArrowUp size={16} strokeWidth={2.5} />
            {pending.length} new {pending.length === 1 ? "post" : "posts"}
          </button>
        </div>
      )}

      <InstallHelperCard />

      {loading ? (
        <>
          <PostSkeleton />
          <PostSkeleton photo={false} />
        </>
      ) : posts.length === 0 ? (
        <EmptyFeed />
      ) : (
        <>
          <div className="divide-y divide-line/70">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="flex flex-col items-center gap-2 px-4 pt-6 pb-10 text-center text-[14px] text-muted">
            <span className="h-px w-16 bg-line" />
            <p className="mt-3">You&apos;re all caught up.</p>
          </div>
        </>
      )}
    </>
  );
}

function EmptyFeed() {
  return (
    <div className="flex flex-col items-center px-8 py-20 text-center">
      <Hanko size={64} className="opacity-90" />
      <h2 className="mt-6 font-serif text-xl font-bold">Nothing here yet</h2>
      <p className="mt-2 text-muted">Share the first photo and get things started.</p>
      <Link href="/new" className="mt-6 flex h-11 items-center rounded-full bg-accent px-6 font-semibold text-on-accent">
        Share something
      </Link>
    </div>
  );
}
