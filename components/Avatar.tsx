import type { User } from "@/lib/types";

// Traditional colours that all read well behind white initials.
const AVATAR_COLOURS = [
  "#165e83", // 藍 ai
  "#3e8e62", // 若竹 wakatake
  "#c98a00", // 山吹 yamabuki
  "#7a6faf", // 藤 fuji
  "#b7282e", // 茜 akane
  "#7a7430", // 鶯 uguisu
  "#95483f", // 鳶 tobi
  "#2c3a5c", // 鉄紺 tetsukon
];

function colourFor(id: string): string {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_COLOURS[h % AVATAR_COLOURS.length];
}

export function Avatar({
  user,
  size = 36,
  ring = false,
  className = "",
}: {
  user: Pick<User, "id" | "name" | "avatar">;
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  const ringClass = ring ? "ring-2 ring-bg" : "";
  if (user.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatar}
        alt=""
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${ringClass} ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 place-items-center rounded-full font-semibold text-white select-none ${ringClass} ${className}`}
      style={{ width: size, height: size, background: colourFor(user.id), fontSize: size * 0.42 }}
    >
      {user.name.slice(0, 1).toUpperCase()}
    </span>
  );
}
