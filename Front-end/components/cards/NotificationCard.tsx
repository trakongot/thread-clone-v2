import { cn, formatTimeAgo } from '@/lib/utils';
import { Notification } from '@/types/notificationType';
import Link from 'next/link';
import { Button } from '../custom/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type Props = {
  data: Notification;
};

export const NotificationCard = ({ data }: Props) => {
  const getMessage = () => {
    switch (data.type) {
      case 'follow':
        return `started following you`;
      case 'like':
        return `liked your thread`;
      case 'comment':
        return `commented on your thread`;
      case 'system':
        return data.message || 'System update';
      default:
        return 'New notification';
    }
  };

  const getLink = () => {
    switch (data.type) {
      case 'like':
        return `/thread/${data.entityId}`;
      case 'comment':
        return `/thread/${data.entityId}`;
      case 'follow':
        return `/profile/${data.sender?._id}`;
      case 'system':
        return '#';
      default:
        return '#';
    }
  };

  return (
    <div
      className={cn(
        'p-4 mb-4 rounded-lg border-gray-700 border flex items-center justify-between transition-all bg-white text-gray-800',
        {
          'bg-gray-100 text-red-400': data.type === 'system',
          'bg-gray-100 text-muted': data.isRead === true,
        },
      )}
    >
      <div className="flex w-full items-center gap-2">
        <Avatar className="size-7">
          <AvatarImage src={data.sender?.profilePic} alt="avatar" />
          <AvatarFallback>
            <AvatarImage
              src="https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png"
              alt="avatar"
            />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 dark:text-white">
            <h4 className="text-lg font-semibold">
              {data?.sender?.name || 'stranger'}
            </h4>
            <p className="text-sm">{getMessage()}</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {formatTimeAgo(data.createdAt)}
          </p>
        </div>
      </div>

      <Link href={getLink()}>
        <Button className="ml-4 rounded-md bg-black px-4 py-2 text-white transition duration-300 hover:bg-gray-700">
          Go to {data.type}
        </Button>
      </Link>
    </div>
  );
};
