'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
}

function UserCard({ id, name, username, imgUrl }: Readonly<Props>) {
  const router = useRouter();
  return (
    <article className="flex flex-col justify-between gap-4 max-xs:rounded-xl  max-xs:bg-light-3 max-xs:p-4 dark:max-xs:bg-dark-3 xs:flex-row xs:items-center">
      <div className="flex flex-1 items-start justify-start gap-3 xs:items-center">
        <div className="relative size-12">
          <Image
            src={imgUrl}
            alt="user_logo"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className=" text-primary dark:text-light-1">{name}</h4>
          <p className=" text-gray-500 dark:text-gray-1">@{username}</p>
        </div>
      </div>

      <Button
        className="min-w-[74px] rounded-lg bg-dark-4 text-[12px] text-light-1 dark:bg-primary-500"
        onClick={() => {
          router.push(`/profile/${id}`);
        }}
      >
        View
      </Button>
    </article>
  );
}

export default UserCard;
