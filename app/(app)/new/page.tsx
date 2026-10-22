"use client";

import { Camera, ChevronLeft, ImagePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Sheet, SheetButton } from "@/components/Sheet";
import { MAX_PHOTOS } from "@/lib/config";
import { useStore } from "@/lib/store";
import type { Photo } from "@/lib/types";

export default function NewPostPage() {
  return (
    <AppShell hideTabs>
      <Composer />
    </AppShell>
  );
}

// Reads a picked file's size. (The real app will also shrink it and strip
// location data here, before uploading.)
function loadPhoto(file: File): Promise<Photo> {
  return new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ src, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = src;
  });
}

function Composer() {
  const { me, addPost, showToast } = useStore();
  const router = useRouter();
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const libraryInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const canShare = body.trim().length > 0 || photos.length > 0;
  const full = photos.length >= MAX_PHOTOS;

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    const room = MAX_PHOTOS - photos.length;
    const picked = Array.from(files).slice(0, room);
    if (files.length > room) showToast(`Up to ${MAX_PHOTOS} photos per post`);
    const loaded = await Promise.all(picked.map(loadPhoto));
    setPhotos((p) => [...p, ...loaded]);
  };

  const move = (i: number) =>
    setPhotos((p) => {
      const next = [...p];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });

  const cancel = () => (canShare ? setConfirmDiscard(true) : router.back());

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="pt-safe sticky top-0 z-30 border-b border-line/70 bg-bg/90 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-2">
          <button type="button" onClick={cancel} className="h-11 rounded-full px-3 text-[16px] text-muted active:bg-line/60">
            Cancel
          </button>
          <h1 className="font-serif text-lg font-bold">New post</h1>
          <button
            type="button"
            disabled={!canShare}
            onClick={() => {
              addPost(body.trim(), photos);
              router.push("/");
            }}
            className="mr-1 h-10 rounded-full bg-accent px-5 text-[15px] font-semibold text-on-accent disabled:opacity-35"
          >
            Share
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col px-4 pt-4">
        <div className="flex gap-3">
          <Avatar user={me} size={40} />
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder={photos.length ? "Write a caption…" : "What's happening?"}
            aria-label="Caption or status"
            maxLength={2000}
            rows={3}
            autoFocus
            className="min-h-24 flex-1 resize-none bg-transparent pt-2 focus-visible:outline-none font-serif text-[19px] leading-snug outline-none placeholder:text-muted/70"
          />
        </div>

        {photos.length > 0 && (
          <div className="no-scrollbar -mx-4 mt-4 flex gap-2.5 overflow-x-auto px-4 pb-2">
            {photos.map((photo, i) => (
              <div key={photo.src} className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt={`Photo ${i + 1}`} className="h-28 w-28 rounded-xl object-cover shadow-soft" />
                {i === 0 && photos.length > 1 && (
                  <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white">
                    Cover
                  </span>
                )}
                {i > 0 && (
                  <button
                    type="button"
                    aria-label={`Move photo ${i + 1} earlier`}
                    onClick={() => move(i)}
                    className="absolute bottom-1.5 left-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                <button
                  type="button"
                  aria-label={`Remove photo ${i + 1}`}
                  onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                  className="absolute top-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {!full && (
              <button
                type="button"
                onClick={() => libraryInput.current?.click()}
                aria-label="Add more photos"
                className="grid h-28 w-28 shrink-0 place-items-center rounded-xl border-2 border-dashed border-line text-muted"
              >
                <ImagePlus size={26} strokeWidth={1.5} />
              </button>
            )}
          </div>
        )}

        <p className="mt-auto pt-6 pb-3 text-center text-[13px] text-muted">
          Photos are shrunk and location data is removed before sharing.
        </p>
      </div>

      <div className="pb-safe sticky bottom-0 border-t border-line/70 bg-bg/90 backdrop-blur-md">
        <div className="flex gap-2 p-3">
          <button
            type="button"
            disabled={full}
            onClick={() => cameraInput.current?.click()}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-surface font-medium shadow-soft disabled:opacity-40"
          >
            <Camera size={20} className="text-accent-2" /> Camera
          </button>
          <button
            type="button"
            disabled={full}
            onClick={() => libraryInput.current?.click()}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-surface font-medium shadow-soft disabled:opacity-40"
          >
            <ImagePlus size={20} className="text-accent-2" /> Photos
          </button>
        </div>
      </div>

      <input ref={libraryInput} type="file" accept="image/*" multiple hidden onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />

      <Sheet open={confirmDiscard} onClose={() => setConfirmDiscard(false)} title="Discard this post?">
        <SheetButton danger onClick={() => router.back()}>Discard</SheetButton>
        <SheetButton onClick={() => setConfirmDiscard(false)}>Keep editing</SheetButton>
      </Sheet>
    </div>
  );
}
