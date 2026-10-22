export function PostSkeleton({ photo = true }: { photo?: boolean }) {
  return (
    <div className="animate-shimmer px-4 py-5" aria-hidden>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-line" />
        <div className="h-3.5 w-28 rounded-full bg-line" />
      </div>
      {photo ? (
        <div className="aspect-[4/5] w-full rounded-2xl bg-line" />
      ) : (
        <div className="h-24 w-full rounded-2xl bg-line" />
      )}
      <div className="mt-4 h-3.5 w-2/3 rounded-full bg-line" />
    </div>
  );
}
