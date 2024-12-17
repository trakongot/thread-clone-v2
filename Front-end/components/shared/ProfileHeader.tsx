import useUserStore from '@/store/useUserStore';
import { User } from '@/types/userType';
import { Edit2Icon, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../custom/button';

function ProfileHeader({
  data,
  className,
}: Readonly<{ data: User; className?: string }>) {
  const currentUser = useUserStore((state) => state.user);
  const isOwnerProfile = currentUser?._id === data._id;

  return (
    <div
      className={`flex w-full flex-col justify-start rounded-xl border bg-light-1 px-4 py-5 shadow-md ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative size-20 object-cover">
            <Image
              src={data?.profilePic ?? ''}
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-lg dark:text-light-1">{data.name}</h2>
            <p className="dark:text-gray-1">@{data.username}</p>
          </div>
        </div>
        {isOwnerProfile ? (
          <Link href="/settings/profile">
            <div className="flex cursor-pointer items-center gap-5 rounded-lg bg-dark-3 px-4 py-3">
              <Edit2Icon className="size-4 text-white" />
              <p className="text-light-2  max-sm:hidden">Edit</p>
            </div>
          </Link>
        ) : (
          <Button className="flex  cursor-pointer items-center gap-2 rounded-lg bg-dark-3 px-4 py-3">
            <UserPlus className="size-5" />
            <p className="text-light-2  max-sm:hidden">Follow</p>
          </Button>
        )}
      </div>

      <p className="mt-6 max-w-lg dark:text-light-2">{data.bio}</p>

      <div className="mt-12 h-0.5 w-full dark:bg-dark-3" />
    </div>
  );
}

export default ProfileHeader;
