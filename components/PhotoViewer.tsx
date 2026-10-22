"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import type { Photo } from "@/lib/types";

// Full-screen viewer: swipe between photos, pinch to zoom, swipe down to close.
// Desktop: arrow keys and Esc.
export function PhotoViewer({
  photos,
  startIndex,
  onClose,
}: {
  photos: Photo[];
  startIndex: number;
  onClose: (index: number) => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [index, setIndex] = useState(startIndex);
  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex, watchDrag: !zoomed });
  const [dragY, setDragY] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const vertical = useRef(false);

  const close = useCallback(() => onClose(emblaApi?.selectedScrollSnap() ?? index), [emblaApi, index, onClose]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [close, emblaApi]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (zoomed || e.touches.length !== 1) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    vertical.current = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current || zoomed) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (!vertical.current && Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) vertical.current = true;
    if (vertical.current) setDragY(Math.max(0, dy));
  };
  const onTouchEnd = () => {
    if (vertical.current && dragY > 110) close();
    setDragY(0);
    touchStart.current = null;
    vertical.current = false;
  };

  const fade = Math.max(0.35, 1 - dragY / 400);

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-50 flex flex-col"
      style={{ background: `rgb(0 0 0 / ${fade})` }}
      role="dialog"
      aria-modal
      aria-label="Photo viewer"
    >
      <div className="pt-safe absolute inset-x-0 top-0 z-10 flex items-center justify-between px-2">
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="grid h-12 w-12 place-items-center rounded-full text-white active:bg-white/10"
        >
          <X size={26} />
        </button>
        {photos.length > 1 && (
          <span className="pr-4 text-[14px] text-white/80 tabular-nums">
            {index + 1} / {photos.length}
          </span>
        )}
      </div>

      <div
        className="flex-1 overflow-hidden"
        ref={emblaRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex h-full" style={{ transform: `translateY(${dragY}px)`, transition: dragY ? "none" : "transform 150ms" }}>
          {photos.map((photo, i) => (
            <div key={photo.src + i} className="relative h-full min-w-0 shrink-0 grow-0 basis-full">
              <TransformWrapper
                minScale={1}
                maxScale={4}
                doubleClick={{ mode: "toggle", step: 1.5 }}
                panning={{ disabled: !zoomed }}
                onTransform={(_, state) => setZoomed(state.scale > 1.01)}
              >
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.src} alt={photo.alt ?? ""} draggable={false} className="max-h-dvh max-w-[100vw] object-contain select-none" />
                </TransformComponent>
              </TransformWrapper>
            </div>
          ))}
        </div>
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute top-1/2 left-4 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:grid"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute top-1/2 right-4 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:grid"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}
