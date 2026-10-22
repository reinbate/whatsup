import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";

// "now", "5m", "2h", "3d", then a date like "12 Mar".
export function timeAgo(ts: number, now = Date.now()): string {
  const mins = differenceInMinutes(now, ts);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = differenceInHours(now, ts);
  if (hours < 24) return `${hours}h`;
  const days = differenceInDays(now, ts);
  if (days < 7) return `${days}d`;
  return format(ts, "d MMM");
}

export function fullDate(ts: number): string {
  return format(ts, "d MMMM yyyy, HH:mm");
}

// "Maya", "Maya and Sam", "Maya, Sam and 2 others"
export function namesSummary(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  const rest = names.length - 2;
  return `${names[0]}, ${names[1]} and ${rest} ${rest === 1 ? "other" : "others"}`;
}

// Frame shape for a photo carousel: the first photo's shape, kept between
// 4:5 (portrait) and 1.91:1 (wide), like the plan says.
export function frameRatio(width: number, height: number): number {
  const r = width / height;
  return Math.min(1.91, Math.max(0.8, r));
}
