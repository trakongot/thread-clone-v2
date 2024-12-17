'use client';

import { getNotifications } from '@/apis/notification';
import { NotificationCard } from '@/components/cards/NotificationCard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useSocketStore } from '@/store/useSocketStore';
import useUserStore from '@/store/useUserStore';
import { BellRing } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

const Page = () => {
  const { user } = useUserStore();
  const pageSize = 2;

  // Local state for notifications and pagination
  const { notifications, setNotifications } = useSocketStore();
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // React Query for fetching notifications
  const { isLoading, isError, refetch, isFetching } = useQuery(
    ['notifications', pageNumber],
    () => getNotifications({ pageNumber, pageSize }),
    {
      enabled: !!user?._id,
      onSuccess: (data) => {
        setNotifications(data.notifications, 4);
        setHasNextPage(data.isNext);
      },
      onError: () => {
        console.error('Error fetching notifications');
      },
      keepPreviousData: true,
    },
  );

  // Load more notifications
  const handleLoadMore = () => {
    if (hasNextPage && !isFetching) {
      setPageNumber((prev) => prev + 1);
    }
  };

  // Fetch initial notifications when user changes
  useEffect(() => {
    if (user?._id) {
      setNotifications([], 0);
      setPageNumber(1);
      refetch();
    }
  }, [user?._id, refetch, setNotifications]);

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex flex-wrap justify-between">
          <div className="flex w-full flex-col md:w-1/2">
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              You have {notifications.filter((n) => !n.isRead).length} unread
              messages.
            </CardDescription>
          </div>
          <div className="flex w-full justify-end space-x-4 rounded-md p-4 md:w-1/2">
            <BellRing />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Push Notifications
              </p>
              <p className="text-sm text-muted-foreground">
                Send notifications to device.
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </CardHeader>
      <CardContent className="no-scrollbar mt-9 max-h-[80vh] overflow-auto pb-10">
        <div>
          {isLoading && pageNumber === 1 ? (
            <p>Loading notifications...</p>
          ) : isError ? (
            <p>Error: {'Failed to load notifications'}</p>
          ) : (
            <>
              {notifications.map((notification) => (
                <NotificationCard key={notification._id} data={notification} />
              ))}
              {hasNextPage && (
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isFetching || !hasNextPage}
                  >
                    {isFetching ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
