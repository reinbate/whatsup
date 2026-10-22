"use client";

import { MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fullDate, timeAgo } from "@/lib/format";
import { ME_ID } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import type { Post } from "@/lib/types";
import { Avatar } from "./Avatar";
import { LikeButton } from "./LikeButton";
import { LikedBy } from "./LikedBy";
import { PhotoCarousel } from "./PhotoCarousel";
import { Sheet, SheetButton } from "./Sheet";

export function PostCard({ post, variant = "feed" }: { post: Post; variant?: "feed" | "detail" }) {
  const { userById, toggleLike, like, editPost, deletePost, showToast } = useStore();
  const router = useRouter();
  const author = userById(post.authorId);
  const mine = post.authorId === ME_ID;
  const liked = post.likes.includes(ME_ID);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.body);
  const lastComment = post.comments.at(-1);
  const isStatus = post.photos.length === 0;

  return (
    <article className="px-4 py-5" aria-label={`Post by ${author.name}`}>
      <header className="mb-3 flex items-center gap-3">
        <Avatar user={author} size={36} />
        <div className="min-w-0 flex-1 leading-tight">
          <span className="font-semibold">{author.name}</span>
          <span className="text-muted"> · </span>
          <time dateTime={new Date(post.createdAt).toISOString()} title={fullDate(post.createdAt)} className="text-[14px] text-muted">
            {timeAgo(post.createdAt)}
          </time>
        </div>
        {mine && (
          <button
            type="button"
            aria-label="Post options"
            onClick={() => setMenuOpen(true)}
            className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-muted active:bg-line/60"
          >
            <MoreHorizontal size={22} />
          </button>
        )}
      </header>

      {isStatus ? (
        editing ? null : (
          <div className="rounded-2xl bg-status px-5 py-6 shadow-soft">
            <p className="font-serif text-[21px] leading-snug font-medium whitespace-pre-wrap">{post.body}</p>
          </div>
        )
      ) : (
        <PhotoCarousel photos={post.photos} uploading={post.uploading} onDoubleTap={() => like(post.id)} />
      )}

      <div className="mt-2 flex items-center gap-1">
        <LikeButton liked={liked} count={post.likes.length} onToggle={() => toggleLike(post.id)} />
        <Link
          href={`/post/${post.id}`}
          aria-label={`Comments (${post.comments.length})`}
          className="flex h-11 min-w-11 items-center gap-1.5 rounded-full px-2 active:opacity-70"
        >
          <MessageCircle size={23} strokeWidth={1.75} className="text-accent-2" />
          {post.comments.length > 0 && <span className="text-[15px] tabular-nums">{post.comments.length}</span>}
        </Link>
      </div>

      {editing ? (
        <form
          className="mt-1"
          onSubmit={(e) => {
            e.preventDefault();
            editPost(post.id, draft.trim());
            setEditing(false);
            showToast("Saved");
          }}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            autoFocus
            aria-label="Edit caption"
            className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-[16px] outline-none focus:border-accent-2"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => { setEditing(false); setDraft(post.body); }} className="h-10 rounded-full px-4 text-muted">
              Cancel
            </button>
            <button type="submit" disabled={isStatus && !draft.trim()} className="h-10 rounded-full bg-accent px-5 font-semibold text-on-accent disabled:opacity-40">
              Save
            </button>
          </div>
        </form>
      ) : (
        !isStatus && post.body && <p className="mt-0.5 text-[16px] leading-relaxed whitespace-pre-wrap">{post.body}</p>
      )}

      {variant === "detail" && <div className="mt-3"><LikedBy likes={post.likes} /></div>}

      {variant === "feed" && lastComment && (
        <div className="mt-2 text-[15px] leading-relaxed">
          <p className="line-clamp-2">
            <span className="font-semibold">{userById(lastComment.authorId).name}</span> {lastComment.body}
          </p>
          {post.comments.length > 1 && (
            <Link href={`/post/${post.id}`} className="mt-0.5 inline-block text-[14px] text-muted">
              View all {post.comments.length} comments
            </Link>
          )}
        </div>
      )}

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)}>
        <SheetButton icon={<Pencil size={20} />} onClick={() => { setMenuOpen(false); setEditing(true); }}>
          {isStatus ? "Edit status" : "Edit caption"}
        </SheetButton>
        <SheetButton danger icon={<Trash2 size={20} />} onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}>
          Delete post
        </SheetButton>
        <SheetButton onClick={() => setMenuOpen(false)}>Cancel</SheetButton>
      </Sheet>

      <Sheet open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete this post?">
        <p className="px-4 pb-3 text-[15px] text-muted">It will be gone for everyone, including the comments.</p>
        <SheetButton
          danger
          onClick={() => {
            setConfirmDelete(false);
            deletePost(post.id);
            showToast("Post deleted");
            if (variant === "detail") router.replace("/");
          }}
        >
          Delete
        </SheetButton>
        <SheetButton onClick={() => setConfirmDelete(false)}>Keep it</SheetButton>
      </Sheet>
    </article>
  );
}
