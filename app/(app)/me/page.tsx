"use client";

import { Bell, Camera, ChevronRight, LogOut, Smartphone, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { InstallSteps, isStandalone } from "@/components/InstallHelper";
import { Sheet } from "@/components/Sheet";
import { APP_NAME } from "@/lib/config";
import { ME_ID } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export default function MePage() {
  return (
    <AppShell>
      <header className="pt-safe sticky top-0 z-30 border-b border-line/70 bg-bg/90 backdrop-blur-md">
        <h1 className="flex h-14 items-center px-4 font-serif text-xl font-bold">Me</h1>
      </header>
      <Profile />
    </AppShell>
  );
}

function Profile() {
  const { me, posts, updateMe, notificationsOn, setNotificationsOn, signOut, showToast } = useStore();
  const router = useRouter();
  const [name, setName] = useState(me.name);
  const [installOpen, setInstallOpen] = useState(false);
  const [standalone, setStandalone] = useState(true);
  const avatarInput = useRef<HTMLInputElement>(null);
  const mine = posts.filter((p) => p.authorId === ME_ID);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStandalone(isStandalone());
  }, []);

  const row = "flex h-14 w-full items-center gap-3 px-4 text-left text-[16px] active:bg-line/50 md:hover:bg-line/30";

  return (
    <div className="pb-6">
      <section className="flex flex-col items-center px-4 pt-8 pb-6">
        <button
          type="button"
          onClick={() => avatarInput.current?.click()}
          aria-label="Change profile photo"
          className="relative"
        >
          <Avatar user={me} size={96} />
          <span className="absolute right-0 bottom-0 grid h-8 w-8 place-items-center rounded-full border-2 border-bg bg-accent-2 text-white">
            <Camera size={15} />
          </span>
        </button>
        <input
          ref={avatarInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) updateMe({ avatar: URL.createObjectURL(f) });
          }}
        />
        <label className="mt-4 w-full max-w-60">
          <span className="sr-only">Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              const n = name.trim() || me.name;
              setName(n);
              if (n !== me.name) {
                updateMe({ name: n });
                showToast("Name updated");
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            className="w-full rounded-xl bg-transparent py-1 text-center font-serif text-2xl font-bold outline-none focus:bg-surface"
          />
        </label>
        <p className="text-[14px] text-muted">{me.email}</p>
      </section>

      <section className="mx-4 overflow-hidden rounded-2xl bg-surface shadow-soft">
        <div className={row}>
          <Bell size={20} className="text-accent-2" />
          <div className="flex-1">
            <p>Notifications</p>
            {!standalone && <p className="text-[12px] text-muted">Add to home screen first</p>}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notificationsOn}
            aria-label="Notifications"
            onClick={() => {
              if (!standalone && !notificationsOn) {
                setInstallOpen(true);
                return;
              }
              setNotificationsOn(!notificationsOn);
              showToast(notificationsOn ? "Notifications off" : "Notifications on");
            }}
            className={`relative h-8 w-13 rounded-full transition-colors ${notificationsOn ? "bg-accent" : "bg-line"}`}
          >
            <span
              className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${notificationsOn ? "translate-x-5" : ""}`}
            />
          </button>
        </div>
        <div className="mx-4 h-px bg-line/70" />
        <button type="button" className={row} onClick={() => setInstallOpen(true)}>
          <Smartphone size={20} className="text-accent-2" />
          <span className="flex-1">Add to home screen</span>
          <ChevronRight size={18} className="text-muted" />
        </button>
        {me.isAdmin && (
          <>
            <div className="mx-4 h-px bg-line/70" />
            <Link href="/me/friends" className={row}>
              <Users size={20} className="text-accent-2" />
              <span className="flex-1">Friends &amp; invites</span>
              <ChevronRight size={18} className="text-muted" />
            </Link>
          </>
        )}
        <div className="mx-4 h-px bg-line/70" />
        <button
          type="button"
          className={`${row} text-accent`}
          onClick={() => {
            signOut();
            router.replace("/login");
          }}
        >
          <LogOut size={20} />
          <span className="flex-1">Sign out</span>
        </button>
      </section>

      <section className="mt-8 px-4" aria-label="Your posts">
        <h2 className="mb-3 font-serif text-lg font-bold">Your posts</h2>
        {mine.length === 0 ? (
          <p className="text-muted">Nothing yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {mine.map((p) => (
              <Link key={p.id} href={`/post/${p.id}`} className="aspect-square overflow-hidden rounded-lg bg-status">
                {p.photos[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photos[0].src} alt={p.photos[0].alt ?? ""} className="h-full w-full object-cover" />
                ) : (
                  <span className="line-clamp-4 p-2.5 font-serif text-[13px] leading-snug">{p.body}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <p className="mt-10 px-6 text-center text-[12px] text-muted">
        {APP_NAME} preview · sample data, nothing is saved
      </p>

      <Sheet open={installOpen} onClose={() => setInstallOpen(false)} title="Add to home screen">
        <div className="px-3 pb-2">
          <InstallSteps />
        </div>
      </Sheet>
    </div>
  );
}
