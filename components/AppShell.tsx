"use client";

import { House, Plus, WifiOff } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/lib/config";
import { useStore } from "@/lib/store";
import { Avatar } from "./Avatar";
import { Hanko } from "./Hanko";

// Wraps every signed-in screen: bottom tabs on phones, sidebar on desktop,
// plus the toast, the "posted" stamp and the offline banner.
export function AppShell({
  children,
  hideTabs = false,
}: {
  children: React.ReactNode;
  hideTabs?: boolean;
}) {
  const { ready, signedIn } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (ready && !signedIn) router.replace("/login");
  }, [ready, signedIn, router]);

  if (!ready || !signedIn) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Hanko size={56} className="animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <SideNav />
      <div className="md:pl-20 lg:pl-60">
        <OfflineBanner />
        <main className={`mx-auto w-full max-w-[560px] ${hideTabs ? "" : "pb-[calc(72px+env(safe-area-inset-bottom))]"} md:pb-10`}>
          {children}
        </main>
      </div>
      {!hideTabs && <BottomTabs />}
      <Toast />
      <PostedStamp />
    </div>
  );
}

function BottomTabs() {
  const pathname = usePathname();
  const { me } = useStore();
  const onFeed = pathname === "/";
  const onMe = pathname.startsWith("/me");
  return (
    <nav
      aria-label="Main"
      className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-bg/92 backdrop-blur-md md:hidden"
    >
      <div className="mx-auto grid h-16 max-w-[560px] grid-cols-3 items-center">
        <Link
          href="/"
          aria-current={onFeed ? "page" : undefined}
          className={`flex h-full flex-col items-center justify-center gap-0.5 text-[11px] ${onFeed ? "text-accent" : "text-muted"}`}
        >
          <House size={24} strokeWidth={onFeed ? 2.25 : 1.75} />
          Feed
        </Link>
        <Link href="/new" aria-label="New post" className="flex h-full items-center justify-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-on-accent shadow-soft active:scale-95">
            <Plus size={26} strokeWidth={2.25} />
          </span>
        </Link>
        <Link
          href="/me"
          aria-current={onMe ? "page" : undefined}
          className={`flex h-full flex-col items-center justify-center gap-0.5 text-[11px] ${onMe ? "text-accent" : "text-muted"}`}
        >
          <Avatar user={me} size={24} className={onMe ? "ring-2 ring-accent ring-offset-1 ring-offset-bg" : ""} />
          Me
        </Link>
      </div>
    </nav>
  );
}

function SideNav() {
  const pathname = usePathname();
  const { me } = useStore();
  const item = (active: boolean) =>
    `flex h-12 items-center gap-4 rounded-xl px-3 text-[16px] transition-colors hover:bg-line/50 justify-center lg:justify-start ${
      active ? "font-semibold text-accent" : "text-ink"
    }`;
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col gap-2 border-r border-line/70 bg-bg/60 px-3 py-6 md:flex lg:w-60 lg:px-4">
      <Link href="/" className="mb-6 flex items-center justify-center gap-3 lg:justify-start lg:px-2" aria-label={`${APP_NAME} home`}>
        <Hanko size={36} />
        <span className="hidden font-serif text-xl font-bold tracking-wide lg:inline">{APP_NAME}</span>
      </Link>
      <Link href="/" className={item(pathname === "/")} aria-current={pathname === "/" ? "page" : undefined}>
        <House size={24} strokeWidth={pathname === "/" ? 2.25 : 1.75} />
        <span className="hidden lg:inline">Feed</span>
      </Link>
      <Link href="/me" className={item(pathname.startsWith("/me"))} aria-current={pathname.startsWith("/me") ? "page" : undefined}>
        <Avatar user={me} size={24} />
        <span className="hidden lg:inline">Me</span>
      </Link>
      <Link
        href="/new"
        className="mt-4 flex h-12 items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-on-accent shadow-soft hover:opacity-90"
        aria-label="New post"
      >
        <Plus size={22} strokeWidth={2.25} />
        <span className="hidden lg:inline">New post</span>
      </Link>
    </aside>
  );
}

function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div
      role="status"
      className="animate-slide-up fixed inset-x-0 bottom-[calc(84px+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 md:bottom-8"
    >
      <div className="rounded-full bg-ink px-4 py-2.5 text-[14px] text-bg shadow-soft">{toast}</div>
    </div>
  );
}

function PostedStamp() {
  const { stampKey } = useStore();
  if (!stampKey) return null;
  return (
    <div key={stampKey} aria-hidden className="pointer-events-none fixed inset-0 z-50 grid place-items-center">
      <div className="animate-stamp opacity-0">
        <Hanko size={120} />
      </div>
    </div>
  );
}

function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!offline) return null;
  return (
    <div role="status" className="pt-safe sticky top-0 z-40 bg-ink text-bg">
      <div className="flex items-center justify-center gap-2 py-2 text-[13px]">
        <WifiOff size={15} /> You&apos;re offline — showing what you&apos;ve seen
      </div>
    </div>
  );
}
