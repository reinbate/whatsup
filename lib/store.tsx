"use client";

// In-memory store for the clickable mockup. Everything here is fake data that
// resets on reload. When the real backend is added, these actions get swapped
// for Supabase calls with the same names.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { INITIAL_ALLOWED, ME_ID, USERS, incomingPost, initialPosts } from "./mock-data";
import type { AllowedEmail, Photo, Post, User } from "./types";

type Store = {
  ready: boolean;
  signedIn: boolean;
  me: User;
  users: User[];
  posts: Post[];
  pending: Post[];
  allowed: AllowedEmail[];
  toast: string | null;
  stampKey: number;
  installDismissed: boolean;
  notificationsOn: boolean;
  userById: (id: string) => User;
  signIn: () => void;
  signOut: () => void;
  isAllowed: (email: string) => boolean;
  toggleLike: (postId: string) => void;
  like: (postId: string) => void;
  addComment: (postId: string, body: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  addPost: (body: string, photos: Photo[]) => void;
  editPost: (postId: string, body: string) => void;
  deletePost: (postId: string) => void;
  showPending: () => void;
  updateMe: (patch: Partial<Pick<User, "name" | "avatar">>) => void;
  addAllowed: (email: string) => void;
  removeAllowed: (email: string) => void;
  showToast: (msg: string) => void;
  setInstallDismissed: (v: boolean) => void;
  setNotificationsOn: (v: boolean) => void;
};

const StoreContext = createContext<Store | null>(null);

function readFlag(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}
function writeFlag(key: string, value: boolean) {
  try {
    if (value) window.localStorage.setItem(key, "1");
    else window.localStorage.removeItem(key);
  } catch {
    // Private mode or blocked storage: the mockup still works, it just won't remember.
  }
}

const uid = () => Math.random().toString(36).slice(2, 10);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [users, setUsers] = useState<User[]>(USERS);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pending, setPending] = useState<Post[]>([]);
  const [allowed, setAllowed] = useState<AllowedEmail[]>(INITIAL_ALLOWED);
  const [toast, setToast] = useState<string | null>(null);
  const [stampKey, setStampKey] = useState(0);
  const [installDismissed, setInstallDismissedState] = useState(false);
  const [notificationsOn, setNotificationsOnState] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const incomingScheduled = useRef(false);

  useEffect(() => {
    // Reading browser storage has to wait until we're in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSignedIn(readFlag("album.signedIn"));
    setInstallDismissedState(readFlag("album.installDismissed"));
    setNotificationsOnState(readFlag("album.notifications"));
    setPosts(initialPosts(Date.now()));
    setReady(true);
  }, []);

  // Simulate a friend posting while you browse, so the "new posts" pill can be seen.
  useEffect(() => {
    if (!signedIn || incomingScheduled.current) return;
    incomingScheduled.current = true;
    const t = setTimeout(() => setPending([incomingPost(Date.now())]), 25_000);
    return () => clearTimeout(t);
  }, [signedIn]);

  const me = users.find((u) => u.id === ME_ID)!;

  const userById = useCallback(
    (id: string) => users.find((u) => u.id === id) ?? { id, name: "Someone", email: "" },
    [users],
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const mapPost = (postId: string, fn: (p: Post) => Post) =>
    setPosts((ps) => ps.map((p) => (p.id === postId ? fn(p) : p)));

  const value: Store = {
    ready,
    signedIn,
    me,
    users,
    posts,
    pending,
    allowed,
    toast,
    stampKey,
    installDismissed,
    notificationsOn,
    userById,
    signIn: () => {
      setSignedIn(true);
      writeFlag("album.signedIn", true);
    },
    signOut: () => {
      setSignedIn(false);
      writeFlag("album.signedIn", false);
    },
    isAllowed: (email) => allowed.some((a) => a.email.toLowerCase() === email.trim().toLowerCase()),
    toggleLike: (postId) =>
      mapPost(postId, (p) => ({
        ...p,
        likes: p.likes.includes(ME_ID) ? p.likes.filter((id) => id !== ME_ID) : [...p.likes, ME_ID],
      })),
    like: (postId) =>
      mapPost(postId, (p) => (p.likes.includes(ME_ID) ? p : { ...p, likes: [...p.likes, ME_ID] })),
    addComment: (postId, body) =>
      mapPost(postId, (p) => ({
        ...p,
        comments: [...p.comments, { id: uid(), authorId: ME_ID, body, createdAt: Date.now() }],
      })),
    deleteComment: (postId, commentId) =>
      mapPost(postId, (p) => ({ ...p, comments: p.comments.filter((c) => c.id !== commentId) })),
    addPost: (body, photos) => {
      const id = uid();
      setPosts((ps) => [
        { id, authorId: ME_ID, body, photos, likes: [], comments: [], createdAt: Date.now(), uploading: photos.length > 0 },
        ...ps,
      ]);
      setStampKey((k) => k + 1);
      if (photos.length > 0) {
        setTimeout(() => mapPost(id, (p) => ({ ...p, uploading: false })), 1800);
      }
    },
    editPost: (postId, body) => mapPost(postId, (p) => ({ ...p, body })),
    deletePost: (postId) => setPosts((ps) => ps.filter((p) => p.id !== postId)),
    showPending: () => {
      setPosts((ps) => [...pending, ...ps]);
      setPending([]);
    },
    updateMe: (patch) => setUsers((us) => us.map((u) => (u.id === ME_ID ? { ...u, ...patch } : u))),
    addAllowed: (email) =>
      setAllowed((list) =>
        list.some((a) => a.email.toLowerCase() === email.toLowerCase())
          ? list
          : [...list, { email: email.toLowerCase(), joined: false }],
      ),
    removeAllowed: (email) => setAllowed((list) => list.filter((a) => a.email !== email)),
    showToast,
    setInstallDismissed: (v) => {
      setInstallDismissedState(v);
      writeFlag("album.installDismissed", v);
    },
    setNotificationsOn: (v) => {
      setNotificationsOnState(v);
      writeFlag("album.notifications", v);
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const s = useContext(StoreContext);
  if (!s) throw new Error("useStore must be used inside <StoreProvider>");
  return s;
}

export function usePost(id: string) {
  const { posts } = useStore();
  return useMemo(() => posts.find((p) => p.id === id), [posts, id]);
}
