import { deleteThread, likeOrUnlikeThread } from '@/apis/threads';
import { copyLink, formatDateString } from '@/lib/utils';
import useTempStore from '@/store/useTempStore';
import useTriggerStore from '@/store/useTriggerStore';
import useUserStore from '@/store/useUserStore';
import { Thread } from '@/types/threadType';
import { HeartFilledIcon, HeartIcon, Share1Icon } from '@radix-ui/react-icons';
import {
  BellMinusIcon,
  BellOffIcon,
  FlagTriangleRightIcon,
  GripIcon,
  LinkIcon,
  ListXIcon,
  MessageCircleIcon,
  Repeat2,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Button } from '../custom/button';
import Carousel from '../custom/carousel';
import Carousel2 from '../custom/carousel2';
import { Dialog, DialogContent, DialogTrigger } from '../custom/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '../ui/menubar';
import { toast } from '../ui/use-toast';
type Props = {
  data: Thread;
  displayType?: 1 | 2;
  className?: string;
  threadUrl: string;
};
export default function ThreadCard({
  data,
  displayType = 1,
  className,
  threadUrl,
}: Readonly<Props>) {
  const [isLiked, setIsLiked] = useState(data.isLiked);
  const [likeCount, setLikeCount] = useState(data.likeCount);
  const { setCurrentThread } = useTempStore();
  const { toggleTrigger } = useTriggerStore();
  const { user } = useUserStore();
  const isOwnerThread = user?._id === data.postedBy._id;
  const pathname = usePathname();
  const isProfilePage = pathname.includes('./profile');
  const queryClient = useQueryClient();

  // API react query
  const { mutate: mutatelike } = useMutation({
    mutationFn: () => likeOrUnlikeThread({ id: data._id }),
    onSuccess: (data) => {
      setLikeCount(data.likeCount);
    },
    onError: (error: any) => {
      console.error('Error liking thread:', error);
      // const errMessage =
      //   error?.response?.data?.error || "Server error, please try again later";
      // alert(errMessage);
    },
  });

  const { mutate: mutatedelete } = useMutation({
    mutationFn: () => deleteThread({ id: data._id }),
    onSuccess: () => {
      // queryClient.invalidateQueries('threads');
      queryClient.invalidateQueries(['threads', 0], {
        refetchActive: true,
        refetchInactive: true,
      });

      toast({
        title: 'Delete Success',
      });
    },
    onError: (error: any) => {
      console.error('Error delete thread:', error);
    },
  });
  const handleDelete = () => {
    mutatedelete();
  };
  const handleLike = () => {
    if (isLiked) setLikeCount((prevlikeCount) => prevlikeCount - 1);
    else setLikeCount((prevlikeCount) => prevlikeCount + 1);
    setIsLiked((prevIsLiked) => !prevIsLiked);
    mutatelike();
  };

  const handleOpenPreviewProfile = () => {
    toggleTrigger('isPreviewProfileCardOpened');
  };
  const handleComment = () => {
    setCurrentThread(data);
    toggleTrigger('isCreateThreadCardOpened');
  };
  const handleReport = () => {
    toggleTrigger('isReportCardOpened');
  };
  const quoteThread = `<blockquote class="text-post-media" data-text-post-permalink="${threadUrl}" id="ig-tp-DCYbxucSdAf" style="background:#FFF; border-width: 1px; border-style: solid; border-color: #00000026; border-radius: 16px; max-width:540px; margin: 1px; min-width:270px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
      <a href="${threadUrl}" style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%; font-family: -apple-system, BlinkMacSystemFont, sans-serif;" target="_blank">
        <div style="padding: 40px; display: flex; flex-direction: column; align-items: center;">
          <div style="display:block; height:32px; width:32px; padding-bottom:20px;">
            <svg aria-label="Threads" height="32px" role="img" viewBox="0 0 192 192" width="32px" xmlns="http://www.w3.org/2000/svg">
              <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
            </svg>
          </div>
          <div style="font-size: 15px; line-height: 21px; color: #000000; font-weight: 600;"> View on Threads</div>
        </div>
      </a>
    </blockquote>
    <script async src="https://www.threads.net/embed.js"></script>
    `;
  return (
    <>
      <article
        className={`flex w-full flex-col rounded-xl bg-light-1 p-7 shadow-lg brightness-105 dark:bg-dark-2 ${className}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex w-full flex-1 flex-row gap-4">
            <div className="flex flex-col items-center">
              {isProfilePage || isOwnerThread ? (
                <Link
                  href={`/thread/${data._id}`}
                  className="m-0 flex w-fit items-center border-none bg-transparent p-0 text-inherit shadow-none outline-none hover:bg-transparent focus:outline-none active:bg-transparent"
                >
                  <div className="relative size-11 cursor-pointer overflow-hidden">
                    {data.postedBy.profilePic && (
                      <Avatar>
                        <AvatarImage
                          sizes=""
                          src={data.postedBy.profilePic}
                          alt="avatar"
                        />
                        <AvatarFallback>
                          <AvatarImage
                            sizes="96"
                            src="https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png"
                            alt="avatar"
                          />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="relative mt-2 w-0.5 grow rounded-full bg-slate-300 dark:bg-neutral-800" />
                </Link>
              ) : (
                <Button
                  onClick={handleOpenPreviewProfile}
                  className="m-0 flex w-fit items-center border-none bg-transparent p-0 text-inherit shadow-none outline-none hover:bg-transparent focus:outline-none active:bg-transparent"
                >
                  <div className="relative size-11 cursor-pointer overflow-hidden">
                    {data.postedBy.profilePic && (
                      <Avatar>
                        <AvatarImage
                          sizes=""
                          src={
                            data.postedBy.profilePic ??
                            'https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png'
                          }
                          alt="avatar"
                        />
                        <AvatarFallback>
                          <AvatarImage
                            sizes="96"
                            src="https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png"
                            alt="avatar"
                          />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="relative mt-2 w-0.5 grow rounded-full bg-slate-300 dark:bg-neutral-800" />
                </Button>
              )}
            </div>

            <div className="flex w-full flex-col">
              <div className="flex w-full items-center justify-between">
                {isProfilePage || isOwnerThread ? (
                  <Link
                    href={
                      isProfilePage
                        ? `/thread/${data._id}`
                        : `/profile/${data.postedBy._id}`
                    }
                    className="flex w-fit items-center"
                  >
                    <h4 className="cursor-pointer text-2xl font-semibold dark:text-light-1">
                      {data?.postedBy?.name}
                    </h4>
                    <span className="ml-3 text-xs text-dark-4">
                      {formatDateString(data?.createdAt)}
                    </span>
                  </Link>
                ) : (
                  <Button
                    onClick={handleOpenPreviewProfile}
                    className="m-0 flex w-fit items-center border-none bg-transparent p-0 text-inherit shadow-none outline-none hover:bg-transparent focus:outline-none active:bg-transparent"
                  >
                    <h4 className="cursor-pointer text-2xl font-semibold dark:text-light-1">
                      {data?.postedBy?.name}
                    </h4>
                    <span className="ml-3 text-xs text-dark-4">
                      {formatDateString(data?.createdAt)}
                    </span>
                  </Button>
                )}
                <div className="flex w-11 justify-end">
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger className="flex items-center rounded-full p-2 transition-all duration-150 hover:bg-[#e1e1e1] active:scale-95 data-[state=open]:bg-[#e1e1e1]">
                        <GripIcon className="size-6 cursor-pointer " />
                      </MenubarTrigger>
                      <MenubarContent align="end">
                        <MenubarItem className="flex cursor-default items-center justify-between py-2">
                          Save<MenubarShortcut>⌘CTRL + S</MenubarShortcut>
                        </MenubarItem>
                        {!isOwnerThread && (
                          <>
                            <MenubarItem className="flex cursor-default items-center justify-between py-2">
                              Not interested
                              <BellOffIcon className="size-4 cursor-pointer " />
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem className="flex cursor-default items-center justify-between py-2">
                              Mute
                              <BellMinusIcon className="size-4 cursor-pointer " />
                            </MenubarItem>
                            <MenubarItem className="flex cursor-default items-center justify-between py-2">
                              Block
                              <ListXIcon className="size-4 cursor-pointer" />
                            </MenubarItem>
                            <MenubarItem
                              onClick={handleReport}
                              className="flex cursor-default items-center justify-between py-2"
                            >
                              Report
                              <FlagTriangleRightIcon className="size-4 cursor-pointer" />
                            </MenubarItem>
                          </>
                        )}
                        <MenubarSeparator />
                        <MenubarItem
                          onClick={() => copyLink(threadUrl ?? '')}
                          className="flex cursor-default items-center justify-between py-2"
                        >
                          Copy link
                          <LinkIcon className="size-4 cursor-pointer" />
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                  {isOwnerThread && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div className="!hover:text-red-800 flex cursor-default items-center justify-between py-2 text-red-600">
                          <div className="flex items-center">
                            <Trash2Icon className="size-4 cursor-pointer" />
                          </div>
                          <MenubarSeparator />
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
              <Link href={`/thread/${data._id}`}>
                <p className="mt-2 pb-3 text-sm dark:text-light-2 ">
                  {data?.text}
                </p>
              </Link>
              {data?.media?.length > 0 &&
                (displayType === 1 ? (
                  <Carousel images={data.media} />
                ) : (
                  <Carousel2 images={data.media} />
                ))}
              <div className={`mt-5 flex flex-col gap-3`}>
                <div className="flex gap-3.5">
                  <button
                    onClick={() => handleLike()}
                    className="flex items-center rounded-full px-2 py-1 transition-all duration-150 hover:bg-[#e1e1e1] active:scale-95"
                  >
                    {isLiked ? (
                      <HeartFilledIcon className="mr-px mt-px size-6 cursor-pointer object-contain text-red-600" />
                    ) : (
                      <HeartIcon className="mr-px mt-px size-6 cursor-pointer object-contain text-light-4" />
                    )}
                    <span className="ml-1 text-sm text-light-4">
                      {likeCount}
                    </span>
                  </button>

                  <button
                    onClick={handleComment}
                    className="flex items-center rounded-full px-2 py-1 hover:bg-[#e1e1e1]"
                  >
                    <MessageCircleIcon className="mr-px mt-px size-6 cursor-pointer object-contain text-light-4" />
                    <span className="ml-1 text-sm text-light-4">
                      {data?.commentCount}
                    </span>
                  </button>
                  <button className="flex items-center rounded-full px-2 py-1 hover:bg-[#e1e1e1]">
                    <Repeat2 className="mr-px mt-px size-6 cursor-pointer object-contain text-light-4" />
                    <span className="ml-1 text-sm text-light-4">
                      {data?.repostCount}
                    </span>
                  </button>
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger className="flex items-center rounded-full p-2 transition-all duration-150 hover:bg-[#e1e1e1] active:scale-95 data-[state=open]:bg-[#e1e1e1]">
                        <Share1Icon className="mr-px mt-px size-6 cursor-pointer object-contain text-light-4" />
                      </MenubarTrigger>
                      <MenubarContent align="end">
                        <MenubarItem
                          onClick={() => copyLink(threadUrl ?? '')}
                          className="cursor-default py-2"
                        >
                          Copy Link
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem
                          onClick={() => copyLink(quoteThread)}
                          className="cursor-default py-2"
                        >
                          Get embed code
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      <UserPreviewCard data={data.postedBy} />
    </>
  );
}
type UserPreviewCardProps = {
  _id: string;
  name: string;
  username: string;
  profilePic: string;
  bio: string;
  isFollowed: boolean;
  followerCount: number;
};
function UserPreviewCard({ data }: { data: UserPreviewCardProps }) {
  const { isPreviewProfileCardOpened, toggleTrigger } = useTriggerStore();
  const route = useRouter();

  const handleOpenChange = () => {
    toggleTrigger('isPreviewProfileCardOpened');
  };
  const [isFollowing, setIsFollowing] = useState(data.isFollowed);
  const [followerCount, setFollowerCount] = useState(data.followerCount ?? 0);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);

    setFollowerCount((prevCount) =>
      isFollowing ? prevCount - 1 : prevCount + 1,
    );
  };

  return (
    <Dialog open={isPreviewProfileCardOpened} onOpenChange={handleOpenChange}>
      <DialogTrigger />
      <DialogContent className="rounded-lg bg-white p-6 text-black">
        {/* <DialogHeader className="text-center text-xl font-semibold">
            User Profile
          </DialogHeader> */}
        <DialogContent>
          <div className="flex flex-col items-center space-y-4">
            <Button
              className="border-none bg-transparent text-black shadow-none hover:border-none hover:bg-transparent focus:outline-none active:bg-transparent"
              onClick={() => {
                toggleTrigger('isPreviewProfileCardOpened');
                route.push(`./profile/${data._id}`);
              }}
            >
              <Avatar className="size-24">
                <AvatarImage
                  className="size-32 rounded-full border-2 border-gray-300"
                  src={data.profilePic}
                  alt="avatar"
                />
                <AvatarFallback>
                  <AvatarImage
                    className="size-32 rounded-full border-2 border-gray-300"
                    src="https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png"
                    alt="avatar"
                  />
                </AvatarFallback>
              </Avatar>
              <div className="text-lg font-medium">{data.name}</div>
            </Button>

            <div className="text-sm text-gray-500">@{data.username}</div>
            <div className="text-sm text-gray-500">{data.bio}</div>

            <div className="text-sm text-gray-700">
              {followerCount} Người theo dõi
            </div>
            <Button
              onClick={handleFollowToggle}
              className={`mt-4 ${isFollowing ? 'bg-gray-500' : 'bg-black'} text-white`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </div>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
}
