"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import ThreadCardSekeleton from "@/components/cards/ThreadCardSekeleton";
import { getRepliesThread, getThreadById } from "@/apis/threads";
import ThreadCard from "@/components/cards/ThreadCard";
import { throttle } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  if(!currentUser) {
    toast({title: 'vui lòng đăng nhập'})
    router.push('/sign-in')
  }
  const threadId = params.id;
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 3;
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const loaderRef = useRef<HTMLDivElement>(null);

  const handleScroll = throttle(() => {
    if (loaderRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = loaderRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 100 && !isLoadingMore) {
        setIsLoadingMore(true);
        setPageNumber((prev) => prev + 1);
      }
    }
  }, 200);

  useEffect(() => {
    const divRef = loaderRef.current;
    divRef?.addEventListener("scroll", handleScroll);

    return () => {
      divRef?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (currentUser?.onboarded === false) {
      router.push("/onboarding");
    }
  }, [currentUser, router]);

  const { data: threadData, isLoading: isLoadingThreadData } = useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => getThreadById({ id: threadId }),
    enabled: !!threadId,
  });

  const { data: commentsData, isLoading: isLoadingCommentsData } = useQuery({
    queryKey: ["comments", threadId, pageNumber],
    queryFn: () => getRepliesThread({ id: threadId, pageNumber, pageSize }),
    keepPreviousData: true,
    enabled: !!threadId && isLoadingMore,
  });

  useEffect(() => {
    if (commentsData?.threads) {
      setComments((prevComments) => [...prevComments, ...commentsData.threads]);
      setIsLoadingMore(false);
    }
  }, [commentsData]);

  if (isLoadingThreadData || isLoadingCommentsData) {
    return <p className="no-result">đang tải...</p>;
  }

  if (!threadData) {
    return <p className="no-result">Rất tiếc, chúng tôi không tìm thấy nội dung bạn đang tìm kiếm. Có thể nội dung này đã bị xóa hoặc không tồn tại.</p>;
  }
  return (
    <section
      ref={loaderRef}
      className="no-scrollbar relative mt-10 flex max-h-[80vh] flex-col gap-10 overflow-auto"
    >
      {isLoadingThreadData ? (
        <ThreadCardSekeleton />
      ) : (
        <ThreadCard
          key={threadData._id}
          data={threadData}
          threadUrl={`http://localhost:3000/thread/${threadData._id}`}
        />
      )}

      <div className="my-10">
        {isLoadingCommentsData && comments.length === 0 ? (
          Array(5)
            .fill(0)
            .map(() => <ThreadCardSekeleton key={uuidv4()} />)
        ) : comments.length === 0 ? (
          <p className="no-result">Chưa có bình luận</p>
        ) : (
          comments.map((comment) => (
            <ThreadCard
              threadUrl={`http://localhost:3000/thread/${threadData._id}`}
              className="mt-2"
              key={comment._id}
              data={comment}
            />
          ))
        )}
      </div>
    </section>
  );
}
