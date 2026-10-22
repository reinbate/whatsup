import { HANKO_CHAR } from "@/lib/config";

// Red seal-stamp mark (判子). Used as the logo and the "posted" stamp.
export function Hanko({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 place-items-center rounded-[18%] bg-hanko font-serif font-bold text-[#fbfaf5] select-none ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.62,
        lineHeight: 1,
        transform: "rotate(-4deg)",
        boxShadow: `inset 0 0 0 ${Math.max(1, size * 0.05)}px var(--hanko), inset 0 0 0 ${Math.max(2, size * 0.085)}px #fbfaf5cc`,
      }}
    >
      {HANKO_CHAR}
    </span>
  );
}
