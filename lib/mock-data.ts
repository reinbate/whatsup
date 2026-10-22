import type { AllowedEmail, Photo, Post, User } from "./types";

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const ME_ID = "me";

export const USERS: User[] = [
  { id: ME_ID, name: "Reinhart", email: "you@example.com", isAdmin: true },
  { id: "maya", name: "Maya", email: "maya@example.com" },
  { id: "sam", name: "Sam", email: "sam@example.com" },
  { id: "jo", name: "Jo", email: "jo@example.com" },
  { id: "kenji", name: "Kenji", email: "kenji@example.com" },
  { id: "priya", name: "Priya", email: "priya@example.com" },
  { id: "theo", name: "Theo", email: "theo@example.com" },
];

const p = (name: string, width: number, height: number, alt: string): Photo => ({
  src: `/mock/${name}.jpg`,
  width,
  height,
  alt,
});

const PHOTOS = {
  sunset: p("sunset", 1080, 1350, "Sun setting over the sea"),
  beach: p("beach", 1600, 1000, "Red umbrella on an empty beach"),
  sakura: p("sakura", 1080, 1350, "Cherry blossom branch"),
  city: p("city", 1080, 1350, "City lights at night"),
  mountains: p("mountains", 1600, 1000, "Layers of mountains in haze"),
  lake: p("lake", 1080, 1080, "Small boat on a still lake"),
  forest: p("forest", 1080, 1350, "Pine forest"),
  coffee: p("coffee", 1080, 1080, "Coffee cup from above"),
};

export function initialPosts(now: number): Post[] {
  return [
    {
      id: "p1",
      authorId: "maya",
      body: "lake day turned beach day 🌊",
      photos: [PHOTOS.sunset, PHOTOS.beach],
      likes: ["sam", "jo", "kenji", "theo"],
      comments: [
        { id: "c1", authorId: "theo", body: "that sunset!!", createdAt: now - 100 * MIN },
        { id: "c2", authorId: "sam", body: "so jealous", createdAt: now - 80 * MIN },
      ],
      createdAt: now - 2 * HOUR,
    },
    {
      id: "p2",
      authorId: "jo",
      body: "finally moved in!! housewarming saturday, bring snacks",
      photos: [],
      likes: ["maya", "sam", "kenji", "priya", "theo", ME_ID, "jo"],
      comments: [
        { id: "c3", authorId: "priya", body: "I'll bring the good chips", createdAt: now - 4 * HOUR },
        { id: "c4", authorId: "kenji", body: "congrats!! 🎉", createdAt: now - 3 * HOUR },
        { id: "c5", authorId: ME_ID, body: "count me in", createdAt: now - 2 * HOUR },
      ],
      createdAt: now - 5 * HOUR,
    },
    {
      id: "p3",
      authorId: "kenji",
      body: "the tree outside my window is going off",
      photos: [PHOTOS.sakura],
      likes: ["maya", "jo"],
      comments: [],
      createdAt: now - 1 * DAY - 3 * HOUR,
    },
    {
      id: "p4",
      authorId: "sam",
      body: "late train home",
      photos: [PHOTOS.city],
      likes: ["priya"],
      comments: [{ id: "c6", authorId: "maya", body: "moody", createdAt: now - 1 * DAY - 20 * HOUR }],
      createdAt: now - 1 * DAY - 22 * HOUR,
    },
    {
      id: "p5",
      authorId: "priya",
      body: "anyone up for a hike this weekend? thinking the ridge trail",
      photos: [],
      likes: ["theo", "maya"],
      comments: [{ id: "c7", authorId: "theo", body: "yes. sunday?", createdAt: now - 2 * DAY }],
      createdAt: now - 2 * DAY - 4 * HOUR,
    },
    {
      id: "p6",
      authorId: "theo",
      body: "trip recap — 3 days, zero signal, 10/10",
      photos: [PHOTOS.mountains, PHOTOS.lake, PHOTOS.forest],
      likes: ["maya", "sam", "jo", "kenji", "priya", ME_ID],
      comments: [
        { id: "c8", authorId: "kenji", body: "where is this??", createdAt: now - 3 * DAY },
        { id: "c9", authorId: "theo", body: "will send you the map", createdAt: now - 3 * DAY + 30 * MIN },
      ],
      createdAt: now - 3 * DAY - 2 * HOUR,
    },
    {
      id: "p7",
      authorId: ME_ID,
      body: "first cup in the new mug",
      photos: [PHOTOS.coffee],
      likes: ["jo", "maya"],
      comments: [{ id: "c10", authorId: "jo", body: "cute mug", createdAt: now - 4 * DAY }],
      createdAt: now - 4 * DAY - 1 * HOUR,
    },
  ];
}

// A post that "arrives" while you're browsing, to show the new-posts pill.
export function incomingPost(now: number): Post {
  return {
    id: "p-new-1",
    authorId: "priya",
    body: "made it to the top 🏔️",
    photos: [PHOTOS.mountains],
    likes: [],
    comments: [],
    createdAt: now,
  };
}

export const INITIAL_ALLOWED: AllowedEmail[] = [
  ...USERS.map((u) => ({ email: u.email, joined: true })),
  { email: "alex@example.com", joined: false },
];
