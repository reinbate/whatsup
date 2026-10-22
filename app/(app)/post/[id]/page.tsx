import { Suspense } from "react";
import { PostSkeleton } from "@/components/Skeleton";
import { PostDetail } from "./PostDetail";

export default function PostPage({ params }: PageProps<"/post/[id]">) {
  return (
    <Suspense fallback={<PostSkeleton />}>
      <PostFromParams params={params} />
    </Suspense>
  );
}

async function PostFromParams({ params }: { params: PageProps<"/post/[id]">["params"] }) {
  const { id } = await params;
  return <PostDetail id={id} />;
}
