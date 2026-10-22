# Whatsup

A small, private photo and status app for a close group of friends. Think early Instagram:
- post photos or a short update;
- see your friends' posts in plain time order;
- comment and like.

No ads, no algorithm, no strangers.

It works in any browser and can be added to your phone's home screen, where it opens like a normal app.

## Current status: clickable mockup

Every screen is built and clickable, but it uses **sample data**: nothing is saved, and it resets when you reload. To try it, sign in as `you@example.com` with any 6 digits.

Next up: real logins, photo storage and notifications using Supabase.

## Put it online (Vercel)

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. Choose **Add New… → Project** and pick this repository.
3. Press **Deploy**. No settings are needed yet.

Every change pushed to `main` goes live automatically.

## Run it on a computer

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Where things live

| Path | What it is |
|---|---|
| `app/` | The screens: feed, new post, post + comments, me, friends, login |
| `components/` | Building blocks: post card, photo carousel, photo viewer, sheets, tab bar |
| `lib/config.ts` | App name, hanko character, photo limit |
| `lib/mock-data.ts` | The sample friends and posts |
| `app/globals.css` | The colour palette (traditional Japanese colours, light and dark) |
