"use client";

import { ArrowUp, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { Sheet, SheetButton } from "@/components/Sheet";
import { TopBar } from "@/components/TopBar";
import { fullDate, timeAgo } from "@/lib/format";
import { ME_ID } from "@/lib/mock-data";
import { usePost, useStore } from "@/lib/store";
import type { Comment } from "@/lib/types";

export function PostDetail({ id }: { id: string }) {
  const post = usePost(id);
  return (
    <AppShell hideTabs>
      <TopBar title={post ? "Post" : "Not found"} />
      {post ? (
        <>
          <PostCard post={post} variant="detail" />
          <Comments postId={post.id} comments={post.comments} />
        </>
      ) : (
        <div className="px-8 py-20 text-center">
          <p className="font-serif text-xl font-bold">This post was deleted</p>
          <Link href="/" className="mt-4 inline-block text-accent-2 underline">
            Back to the feed
          </Link>
        </div>
      )}
    </AppShell>
  );
}

function Comments({ postId, comments }: { postId: string; comments: Comment[] }) {
  const { me, userById, addComment, deleteComment, showToast } = useStore();
  const [text, setText] = useState("");
  const [toDelete, setToDelete] = useState<Comment | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const send = () => {
    const body = text.trim();
    if (!body) return;
    addComment(postId, body);
    setText("");
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  // Long-press your own comment to delete it.
  const startPress = (c: Comment) => {
    if (c.authorId !== ME_ID) return;
    pressTimer.current = setTimeout(() => setToDelete(c), 500);
  };
  const endPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <section aria-label="Comments" className="border-t border-line/70">
      {comments.length === 0 ? (
        <p className="px-4 py-8 text-center text-muted">No comments yet. Say something nice.</p>
      ) : (
        <ul className="space-y-1 px-2 py-3">
          {comments.map((c) => {
            const author = userById(c.authorId);
            const mine = c.authorId === ME_ID;
            return (
              <li
                key={c.id}
                onPointerDown={() => startPress(c)}
                onPointerUp={endPress}
                onPointerLeave={endPress}
                onContextMenu={(e) => mine && e.preventDefault()}
                className="group flex gap-3 rounded-xl px-2 py-2.5 select-none active:bg-line/40"
              >
                <Avatar user={author} size={32} />
                <div className="min-w-0 flex-1 text-[15px] leading-relaxed">
                  <p>
                    <span className="font-semibold">{author.name}</span>{" "}
                    <time title={fullDate(c.createdAt)} className="text-[13px] text-muted">
                      {timeAgo(c.createdAt)}
                    </time>
                  </p>
                  <p className="whitespace-pre-wrap">{c.body}</p>
                </div>
                {mine && (
                  <button
                    type="button"
                    aria-label="Delete comment"
                    onClick={() => setToDelete(c)}
                    className="hidden h-9 w-9 place-items-center rounded-full text-muted opacity-0 group-hover:opacity-100 hover:bg-line/60 focus:opacity-100 md:grid"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <div ref={endRef} className="h-[calc(80px+env(safe-area-inset-bottom))]" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-bg/92 backdrop-blur-md md:left-20 lg:left-60"
      >
        <div className="mx-auto flex max-w-[560px] items-end gap-2 px-3 py-2.5">
          <Avatar user={me} size={32} className="mb-1" />
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && window.matchMedia("(pointer: fine)").matches) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Add a comment…"
            aria-label="Add a comment"
            className="max-h-[120px] min-h-10 flex-1 resize-none rounded-2xl border border-line bg-surface px-4 py-2 text-[16px] outline-none focus:border-accent-2"
          />
          <button
            type="submit"
            aria-label="Send comment"
            disabled={!text.trim()}
            className="mb-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-on-accent disabled:opacity-30"
          >
            <ArrowUp size={20} strokeWidth={2.5} />
          </button>
        </div>
      </form>

      <Sheet open={!!toDelete} onClose={() => setToDelete(null)} title="Delete comment?">
        <SheetButton
          danger
          onClick={() => {
            if (toDelete) deleteComment(postId, toDelete.id);
            setToDelete(null);
            showToast("Comment deleted");
          }}
        >
          Delete
        </SheetButton>
        <SheetButton onClick={() => setToDelete(null)}>Cancel</SheetButton>
      </Sheet>
    </section>
  );
}
