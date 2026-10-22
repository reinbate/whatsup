"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

// Bottom sheet on phones, centred dialog on bigger screens.
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" role="dialog" aria-modal aria-label={title}>
      <button aria-label="Close" className="animate-fade-in absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="animate-slide-up pb-safe relative w-full max-w-md rounded-t-3xl bg-surface shadow-soft md:rounded-3xl md:pb-0">
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line md:hidden" />
        {title && <h2 className="px-6 pt-4 font-serif text-lg font-bold">{title}</h2>}
        <div className="p-3 pb-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function SheetButton({
  children,
  onClick,
  danger,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 w-full items-center gap-3 rounded-xl px-4 text-left text-[16px] active:bg-line/60 md:hover:bg-line/40 ${
        danger ? "text-accent font-medium" : "text-ink"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
