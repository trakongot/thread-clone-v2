'use client';
import { getComments, getThreadsByUser } from '@/apis/threads';
import { getUserById } from '@/apis/user';
import ThreadCard from '@/components/cards/ThreadCard';
import ThreadCardSekeleton from '@/components/cards/ThreadCardSekeleton';
import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadsTab from '@/components/shared/ThreadsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { throttle } from '@/lib/utils';
import useUserStore from '@/store/useUserStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { v4 as uuidv4 } from 'uuid';
// import { toast } from "@/components/ui/use-toast";

const profileTabs = [
  { value: 'threads', label: 'Threads', icon: '/assets/reply.svg' },
  { value: 'replies', label: 'Replies', icon: '/assets/members.svg' },
  { value: 'repost', label: 'Repost', icon: '/assets/tag.svg' },
];

export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  // if (!currentUser) {
  //   toast({title: 'vui lòng đăng nhập'})
  //   router.push("/sign-in");
  // }
  const [activeTab, setActiveTab] = useState('threads');

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 3;
  const profileId = params.id;
  const isOwnerProfile = currentUser?._id === profileId;
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [threads, setThreads] = useState<any[]>([]);
  const loaderRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useQuery({
    queryKey: ['user', profileId],
    queryFn: () => getUserById({ id: profileId }),
    onError: (error) => {
      console.error('Sever bảo trì vui lòng thử lại sau', error);
    },
    enabled: !!profileId,
  });
  const [threadsData, setData] = useState(null);
  const { data, isLoading: isLoadingThreadsData } = useQuery({
    queryKey: ['tabData', activeTab, profileId, pageNumber],
    queryFn: () => {
      if (activeTab === 'threads') {
        return getThreadsByUser({ id: profileId, pageNumber, pageSize });
      } else if (activeTab === 'replies') {
        return getComments({ userId: profileId, pageNumber, pageSize });
      }

      return Promise.resolve(null);
    },
    onSuccess: (data) => {
      if (!data?.threads) setThreads([]);
      else setData(data);
    },
    onError: (error) => {
      console.error('Server bảo trì vui lòng thử lại sau', error);
    },
    enabled: !!profileId, // Bật khi có `profileId`
  });
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
    if (threadsData?.threads) {
      setThreads((prevThreads) => [...prevThreads, ...threadsData.threads]);
      setIsLoadingMore(false);
    }
  }, [threadsData]);
  useEffect(() => {
    const divRef = loaderRef.current;
    divRef?.addEventListener('scroll', handleScroll);

    return () => {
      divRef?.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  if (currentUser?.onboarded === false) {
    router.push('/onboarding');
  }
  if (!userData) return <>loading...</>;
  return (
    <section>
      <ProfileHeader className="mt-0" data={userData} />
      <div
        ref={loaderRef}
        className="no-scrollbar mt-9 max-h-[80vh] overflow-auto pb-40"
      >
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="flex min-h-[50px] flex-1 items-center justify-evenly gap-3 bg-light-1 text-primary shadow-md data-[state=active]:shadow-none dark:bg-dark-4 dark:text-light-2 dark:data-[state=active]:bg-[#0e0e12]">
            {profileTabs.map((tab) => (
              <TabsTrigger
                key={tab.label}
                value={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="ml-1 rounded-none hover:bg-none focus:bg-none data-[state=active]:border-b-2 data-[state=active]:border-b-black dark:text-light-2 "
              >
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={23}
                  height={23}
                  className="object-contain"
                />
                <p className="text-base text-primary max-sm:hidden ">
                  {tab.label}
                </p>

                {tab.label === 'Threads' && (
                  <p className="ml-2 rounded-sm px-2 py-1 dark:bg-light-4 dark:text-light-2">
                    {threadsData?.threads.length ?? 0}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full dark:text-light-1"
            >
              <ThreadsTab
                currentUserId={userData?._id ?? ''}
                accountId={userData?._id ?? ''}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
        <div className="my-4">
          {isLoadingThreadsData && threads?.length === 0 ? (
            Array(5)
              .fill(0)
              .map(() => <ThreadCardSekeleton key={uuidv4()} />)
          ) : threads?.length === 0 ? (
            <p className="no-result">
              {isOwnerProfile
                ? ' Hiện tại, chưa có bài viết nào. Hãy đăng nội dung đầu tiên của bạn!'
                : 'Chưa có nội dung nào được đăng tải.'}
            </p>
          ) : (
            threads?.map((thread) => (
              <ThreadCard
                threadUrl={`http://localhost:3000/thread/${thread?._id}`}
                className="mt-2"
                key={thread._id}
                data={thread}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
