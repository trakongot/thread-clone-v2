'use client';
import { getThreadsBySearch } from '@/apis/search';
import ThreadCard from '@/components/cards/ThreadCard';
import ThreadCardSekeleton from '@/components/cards/ThreadCardSekeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [threads, setThreads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      if (query) {
        setIsLoading(true);
        const data = await getThreadsBySearch({ query });
        setThreads(data.threads);
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [query]);

  return (
    <div className="px-4 pb-80">
      <h1 className="my-2 text-xl font-bold">Search Results for `{query}`</h1>
      <div>
        {isLoading ? (
          Array(5)
            .fill(0)
            .map((_, index) => <ThreadCardSekeleton key={index} />)
        ) : threads.length === 0 ? (
          <p>Không tìm thấy nội dung.</p>
        ) : (
          <ScrollArea className="flex h-[500px] w-full p-1 pr-4 md:overflow-y-hidden">
            {threads.map((thread) => (
              <ThreadCard
                key={thread._id}
                threadUrl={`/thread/${thread._id}`}
                data={{
                  ...thread,
                  postedBy: {
                    ...thread.postedBy,
                    profilePic:
                      thread.postedBy?.profilePic || '/img/avatar.png',
                  },
                  imgs: thread.imgs || [],
                  isliked: thread.isLiked || false,
                  likeCount: thread.likeCount || 0,
                  commentCount: thread.commentCount || 0,
                  repostCount: thread.repostCount || 0,
                }}
                displayType={2}
              />
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
