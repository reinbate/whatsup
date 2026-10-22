"use client";

import { EllipsisVertical, Share, SquarePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/lib/config";
import { useStore } from "@/lib/store";
import { Hanko } from "./Hanko";

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function guessPlatform(): "ios" | "android" {
  if (typeof navigator === "undefined") return "ios";
  return /android/i.test(navigator.userAgent) ? "android" : "ios";
}

export function InstallSteps() {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlatform(guessPlatform());
  }, []);
  const tab = (p: "ios" | "android", label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={platform === p}
      onClick={() => setPlatform(p)}
      className={`h-9 flex-1 rounded-full text-[14px] font-medium ${platform === p ? "bg-surface text-ink shadow-soft" : "text-ink/80"}`}
    >
      {label}
    </button>
  );
  const steps =
    platform === "ios"
      ? [
          { icon: <Share size={18} />, text: <>Tap the <b>Share</b> button in Safari</> },
          { icon: <SquarePlus size={18} />, text: <>Choose <b>Add to Home Screen</b></> },
          { icon: <Hanko size={18} />, text: <>Open {APP_NAME} from your home screen</> },
        ]
      : [
          { icon: <EllipsisVertical size={18} />, text: <>Tap the <b>⋮ menu</b> in Chrome</> },
          { icon: <SquarePlus size={18} />, text: <>Choose <b>Install app</b> or <b>Add to Home screen</b></> },
          { icon: <Hanko size={18} />, text: <>Open {APP_NAME} from your home screen</> },
        ];
  return (
    <div>
      <div role="tablist" className="mb-4 flex gap-1 rounded-full bg-line/60 p-1">
        {tab("ios", "iPhone")}
        {tab("android", "Android")}
      </div>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex items-center gap-3 text-[15px]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-bg text-accent-2">{s.icon}</span>
            <span>
              <span className="text-muted">{i + 1}.</span> {s.text}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[13px] text-muted">Notifications only work once it&apos;s on your home screen.</p>
    </div>
  );
}

// One-time card on the feed for people still using the browser.
export function InstallHelperCard() {
  const { installDismissed, setInstallDismissed } = useStore();
  const [show, setShow] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(!isStandalone());
  }, []);
  if (!show || installDismissed) return null;
  return (
    <section className="animate-slide-up mx-4 mt-4 rounded-2xl border border-line bg-surface p-5 shadow-soft" aria-label="Install the app">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg font-bold">Add {APP_NAME} to your home screen</h2>
          <p className="text-[14px] text-muted">It opens like a normal app and can send you notifications.</p>
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setInstallDismissed(true)}
          className="-mt-1 -mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted active:bg-line/60"
        >
          <X size={20} />
        </button>
      </div>
      <InstallSteps />
      <button
        type="button"
        onClick={() => setInstallDismissed(true)}
        className="mt-4 h-11 w-full rounded-full bg-ink text-[15px] font-semibold text-bg"
      >
        Got it
      </button>
    </section>
  );
}
