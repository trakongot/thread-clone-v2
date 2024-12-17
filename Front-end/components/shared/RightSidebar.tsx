'use client';
import { top10FollowersUser, usersIamFollowing } from '@/apis/user';
import useTriggerStore from '@/store/useTriggerStore';
import { User } from '@/types/userType';
import { useState } from 'react';
import { useQuery } from 'react-query';
import UserCard from '../cards/UserCard';
import { ScrollArea } from '../ui/scroll-area';

export default function RightSidebar() {
  const { LeftSidebarOpened } = useTriggerStore();
  const [topUsersST, settopUsersST] = useState<User[]>([]);
  const [userIamfollowST, setuserIamfollowST] = useState<User[]>([]);
  const { data: topUsers } = useQuery('top10Users', top10FollowersUser, {
    onSuccess: (data) => {
      settopUsersST(data);
    },
    onError: (error) => {
      console.error('Error fetching users:', error);
    },
  });
  const { data: userIamfollow } = useQuery(
    'userIamFollowing',
    usersIamFollowing,
    {
      onSuccess: (data) => {
        console.log('oke', data);
        setuserIamfollowST(data);
      },
      onError: (error) => {
        console.error('Error fetching users:', error);
      },
    },
  );

  console.log('ok1e', topUsers);
  console.log('ok2e', userIamfollow);

  return (
    <>
      {LeftSidebarOpened && (
        <section className="custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-between gap-12 overflow-auto border-l border-l-light-6 px-10 pb-6 pt-28 dark:border-l-dark-4 dark:bg-dark-2 max-xl:hidden">
          <div className="flex flex-1 flex-col justify-start">
            <h3 className=" dark:text-light-1">
              Similar Minds
              <ScrollArea className="m-0 flex w-[350px] list-none flex-col gap-5 p-0">
                {topUsersST?.length === 0 ? (
                  <td colSpan={6} className="py-4 text-center">
                    No users found
                  </td>
                ) : (
                  topUsersST?.map((user) => (
                    <UserCard
                      key={user._id}
                      id={user._id}
                      name={user.name}
                      username={user.username}
                      imgUrl={user.profilePic}
                    />
                  ))
                )}
              </ScrollArea>
              <hr style={{ margin: '40px 0' }} />
              {/* Khmảng cách trên và dưới đường kẻ */}
              <ScrollArea className="m-0 flex h-[350px]  flex-col gap-5 p-0">
                {userIamfollowST?.length === 0 ? (
                  <td colSpan={6} className="py-4 text-center">
                    No users found
                  </td>
                ) : (
                  userIamfollowST?.map((user) => (
                    <UserCard
                      key={user._id}
                      id={user._id}
                      name={user.name}
                      username={user.username}
                      imgUrl={user.profilePic}
                    />
                  ))
                )}
              </ScrollArea>
            </h3>
          </div>
        </section>
      )}
    </>
  );
}
