"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Heart } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { frameRatio } from "@/lib/format";
import type { Photo } from "@/lib/types";
import { PhotoViewer } from "./PhotoViewer";

const DOUBLE_TAP_MS = 280;

export function PhotoCarousel({
  photos,
  onDoubleTap,
  uploading = false,
}: {
  photos: Photo[];
  onDoubleTap: () => void;
  uploading?: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [index, setIndex] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const lastTap = useRef(0);
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // One tap opens the viewer, two quick taps like the post.
  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      if (singleTapTimer.current) clearTimeout(singleTapTimer.current);
      lastTap.current = 0;
      setBurstKey((k) => k + 1);
      onDoubleTap();
      return;
    }
    lastTap.current = now;
    singleTapTimer.current = setTimeout(() => setViewerOpen(true), DOUBLE_TAP_MS);
  }, [onDoubleTap]);

  const ratio = frameRatio(photos[0].width, photos[0].height);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl bg-line/50 shadow-soft" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {photos.map((photo, i) => (
            <button
              type="button"
              key={photo.src + i}
              onClick={handleTap}
              aria-label={`Open photo ${i + 1} of ${photos.length}${photo.alt ? `: ${photo.alt}` : ""}`}
              className="relative min-w-0 shrink-0 grow-0 basis-full"
              style={{ aspectRatio: ratio }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt ?? ""}
                draggable={false}
                loading={i === 0 ? "eager" : "lazy"}
                className={`h-full w-full object-cover transition-opacity duration-150 ${uploading ? "opacity-60" : ""}`}
              />
            </button>
          ))}
        </div>
      </div>

      {photos.length > 1 && (
        <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/45 px-2.5 py-1 text-[12px] font-medium text-white tabular-nums">
          {index + 1}/{photos.length}
        </span>
      )}

      {burstKey > 0 && (
        <div key={burstKey} className="pointer-events-none absolute inset-0 grid place-items-center">
          <Heart size={96} className="animate-heart-burst fill-white text-white opacity-0 drop-shadow-lg" />
        </div>
      )}

      {uploading && (
        <div className="absolute inset-x-4 bottom-4 overflow-hidden rounded-full bg-black/30" role="progressbar" aria-label="Uploading">
          <div className="h-1.5 rounded-full bg-white [animation:upload_1.8s_ease-out_forwards]" />
          <style>{`@keyframes upload { from { width: 4% } to { width: 100% } }`}</style>
        </div>
      )}

      {photos.length > 1 && (
        <div className="mt-2.5 flex justify-center gap-1.5" aria-hidden>
          {photos.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-accent" : "w-1.5 bg-line"}`}
            />
          ))}
        </div>
      )}

      {viewerOpen && (
        <PhotoViewer
          photos={photos}
          startIndex={index}
          onClose={(i) => {
            setViewerOpen(false);
            emblaApi?.scrollTo(i, true);
          }}
        />
      )}
    </div>
  );
}
