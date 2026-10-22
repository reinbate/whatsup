"use client";

import { Copy, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Sheet, SheetButton } from "@/components/Sheet";
import { TopBar } from "@/components/TopBar";
import { APP_NAME } from "@/lib/config";
import { useStore } from "@/lib/store";

export default function FriendsPage() {
  return (
    <AppShell>
      <TopBar title="Friends & invites" backHref="/me" />
      <Friends />
    </AppShell>
  );
}

function Friends() {
  const { allowed, addAllowed, removeAllowed, me, showToast } = useStore();
  const [email, setEmail] = useState("");
  const [toRemove, setToRemove] = useState<string | null>(null);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const copyInvite = async () => {
    const msg = `Hey! I set up ${APP_NAME}, a private photo app just for our group. No ads, no strangers.\n\n1. Open ${window.location.origin} on your phone\n2. Add it to your home screen\n3. Sign in with your email — you'll get a 6-digit code`;
    try {
      await navigator.clipboard.writeText(msg);
      showToast("Invite message copied");
    } catch {
      showToast("Couldn't copy. Try again");
    }
  };

  return (
    <div className="px-4 pt-5 pb-8">
      <p className="text-[15px] text-muted">
        Only people on this list can join. Add their email, then send them the invite message.
      </p>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          addAllowed(email.trim());
          showToast(`${email.trim()} can now join`);
          setEmail("");
        }}
      >
        <input
          type="email"
          inputMode="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="friend@email.com"
          aria-label="Friend's email"
          className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 text-[16px] outline-none focus:border-accent-2"
        />
        <button
          type="submit"
          disabled={!valid}
          className="flex h-12 items-center gap-1.5 rounded-xl bg-accent px-4 font-semibold text-on-accent disabled:opacity-35"
        >
          <UserPlus size={18} /> Add
        </button>
      </form>

      <button
        type="button"
        onClick={copyInvite}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface font-medium shadow-soft"
      >
        <Copy size={18} className="text-accent-2" /> Copy invite message
      </button>

      <ul className="mt-6 overflow-hidden rounded-2xl bg-surface shadow-soft">
        {allowed.map((a, i) => (
          <li key={a.email} className={`flex items-center gap-3 px-4 py-3 ${i ? "border-t border-line/70" : ""}`}>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px]">{a.email}</p>
              <p className={`text-[12px] ${a.joined ? "text-muted" : "text-accent-2"}`}>
                {a.email === me.email ? "You · admin" : a.joined ? "Joined" : "Invited · hasn't joined yet"}
              </p>
            </div>
            {a.email !== me.email && (
              <button
                type="button"
                aria-label={`Remove ${a.email}`}
                onClick={() => setToRemove(a.email)}
                className="grid h-10 w-10 place-items-center rounded-full text-muted active:bg-line/60 md:hover:bg-line/40"
              >
                <Trash2 size={17} />
              </button>
            )}
          </li>
        ))}
      </ul>

      <Sheet open={!!toRemove} onClose={() => setToRemove(null)} title="Remove from the group?">
        <p className="px-4 pb-3 text-[15px] text-muted">
          {toRemove} won&apos;t be able to sign in or see anything any more. Their old posts stay unless you delete them.
        </p>
        <SheetButton
          danger
          onClick={() => {
            if (toRemove) removeAllowed(toRemove);
            setToRemove(null);
            showToast("Removed");
          }}
        >
          Remove
        </SheetButton>
        <SheetButton onClick={() => setToRemove(null)}>Cancel</SheetButton>
      </Sheet>
    </div>
  );
}
