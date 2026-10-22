"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Hanko } from "@/components/Hanko";
import { APP_NAME } from "@/lib/config";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { ready, signedIn, signIn, isAllowed } = useStore();
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [notInvited, setNotInvited] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (ready && signedIn) router.replace("/");
  }, [ready, signedIn, router]);

  return (
    <main className="pt-safe pb-safe flex min-h-dvh flex-col items-center px-6">
      <div className="flex w-full max-w-sm flex-1 flex-col justify-center py-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <Hanko size={72} />
          <h1 className="mt-6 font-serif text-3xl font-bold tracking-wide">{APP_NAME}</h1>
          <p className="mt-1.5 text-muted">just us. no ads.</p>
        </div>

        {step === "email" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isAllowed(email)) {
                setNotInvited(true);
                return;
              }
              setSending(true);
              setTimeout(() => {
                setSending(false);
                setStep("code");
              }, 600);
            }}
          >
            <label htmlFor="email" className="mb-2 block text-[14px] font-medium">
              Your email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setNotInvited(false);
              }}
              placeholder="you@example.com"
              className="h-13 w-full rounded-xl border border-line bg-surface px-4 text-[17px] outline-none focus:border-accent-2"
            />
            {notInvited && (
              <p role="alert" className="mt-3 rounded-xl bg-status px-4 py-3 text-[14px]">
                You&apos;re not on the list yet — ask whoever invited you to add this email.
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="mt-4 h-13 w-full rounded-xl bg-accent text-[17px] font-semibold text-on-accent disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send me a code"}
            </button>
          </form>
        ) : (
          <CodeStep
            email={email}
            onBack={() => setStep("email")}
            onDone={() => {
              signIn();
              router.replace("/");
            }}
          />
        )}
      </div>
      <p className="pb-6 text-center text-[12px] text-muted">
        Preview: sign in as <b>you@example.com</b>, any 6 digits work.
      </p>
    </main>
  );
}

function CodeStep({ email, onBack, onDone }: { email: string; onBack: () => void; onDone: () => void }) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setFrom = (start: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) return;
    const next = [...digits];
    for (let i = 0; i < clean.length && start + i < 6; i++) next[start + i] = clean[i];
    setDigits(next);
    const focusAt = Math.min(start + clean.length, 5);
    refs.current[focusAt]?.focus();
    if (next.every((d) => d)) setTimeout(onDone, 250);
  };

  return (
    <div>
      <p className="mb-5 text-center text-[15px]">
        We sent a 6-digit code to <b>{email}</b>
      </p>
      <div className="flex justify-between gap-2" role="group" aria-label="6-digit code">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            autoFocus={i === 0}
            maxLength={6}
            aria-label={`Digit ${i + 1}`}
            onChange={(e) => {
              if (!e.target.value) {
                const next = [...digits];
                next[i] = "";
                setDigits(next);
                return;
              }
              setFrom(i, e.target.value.slice(d ? 1 : 0));
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
            }}
            onPaste={(e) => {
              e.preventDefault();
              setFrom(0, e.clipboardData.getData("text"));
            }}
            className="h-14 w-full min-w-0 rounded-xl border border-line bg-surface text-center text-2xl font-semibold tabular-nums outline-none focus:border-accent-2"
          />
        ))}
      </div>
      <div className="mt-6 flex justify-between text-[14px]">
        <button type="button" onClick={onBack} className="text-muted underline-offset-2 hover:underline">
          Use a different email
        </button>
        <button type="button" className="text-accent-2 underline-offset-2 hover:underline">
          Resend code
        </button>
      </div>
    </div>
  );
}
