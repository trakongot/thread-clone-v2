'use client';
import { getThreads } from '@/apis/threads';
import ThreadCard from '@/components/cards/ThreadCard';
import ThreadCardSekeleton from '@/components/cards/ThreadCardSekeleton';
import { throttle } from '@/lib/utils';
import useUserStore from '@/store/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

export default function Home({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | undefined };
}>) {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 3;
  const [threads, setThreads] = useState<any[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const user = useUserStore((state) => state.user);

  // Redirect to onboarding if user has not completed it
  useEffect(() => {
    if (user?.onboarded === false) {
      router.push('/onboarding');
    }
  }, [user, router]);

  // Fetch threads data using React Query
  const { isLoading, isFetching } = useQuery(
    ['threads', pageNumber],
    () => getThreads({ pageNumber, pageSize }),
    {
      keepPreviousData: true,
      onSuccess: (newData) => {
        setThreads((prevThreads) => [...prevThreads, ...newData.threads]);
      },
      onError: (err) => {
        console.error('Error fetching threads:', err);
      },
    },
  );

  // Infinite scroll handler with throttle
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (loaderRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = loaderRef.current;
        if (scrollHeight - scrollTop <= clientHeight + 100 && !isFetching) {
          setPageNumber((prev) => prev + 1);
        }
      }
    }, 300); // Adjust delay as needed

    const divRef = loaderRef.current;
    divRef?.addEventListener('scroll', handleScroll);

    return () => {
      divRef?.removeEventListener('scroll', handleScroll);
    };
  }, [isFetching]);

  return (
    <>
      <h1 className="head-text text-left text-2xl font-bold text-dark-1 dark:text-light-1">
        Được Quan Tâm Nhiều
      </h1>
      <section
        ref={loaderRef}
        className="no-scrollbar mt-9 flex max-h-[80vh] flex-col gap-10 overflow-auto pb-40"
      >
        {isLoading && threads.length === 0
          ? Array(5)
              .fill(0)
              .map(() => <ThreadCardSekeleton key={uuidv4()} />)
          : threads.map((thread) => (
              <ThreadCard
                threadUrl={thread._id}
                displayType={2}
                key={thread._id}
                data={thread}
              />
            ))}
        {!isLoading && threads.length === 0 && (
          <p className="no-result">Sever đang bảo trì vui lòng thử lại sau</p>
        )}

        {isFetching && <ThreadCardSekeleton key={uuidv4()} />}
        <div />
      </section>
    </>
  );
}
