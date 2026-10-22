"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/config";
import { useStore } from "@/lib/store";
import { Avatar } from "./Avatar";
import { Hanko } from "./Hanko";

// Brand bar for the feed (phones only; desktop has the sidebar).
export function BrandBar() {
  const { me } = useStore();
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-line/70 bg-bg/90 backdrop-blur-md md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${APP_NAME} home`}>
          <Hanko size={28} />
          <span className="font-serif text-xl font-bold tracking-wide">{APP_NAME}</span>
        </Link>
        <Link href="/me" aria-label="Your profile" className="grid h-11 w-11 place-items-center">
          <Avatar user={me} size={32} />
        </Link>
      </div>
    </header>
  );
}

// Bar with a back button and title, for inner screens.
export function TopBar({
  title,
  backHref = "/",
  right,
}: {
  title: string;
  backHref?: string;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-line/70 bg-bg/90 backdrop-blur-md">
      <div className="grid h-14 grid-cols-[48px_1fr_auto] items-center px-2">
        <button
          type="button"
          aria-label="Back"
          onClick={() => (window.history.length > 1 ? router.back() : router.push(backHref))}
          className="grid h-11 w-11 place-items-center rounded-full active:bg-line/60"
        >
          <ArrowLeft size={22} strokeWidth={1.75} />
        </button>
        <h1 className="truncate text-center font-serif text-lg font-bold">{title}</h1>
        <div className="flex min-w-12 justify-end">{right}</div>
      </div>
    </header>
  );
}
