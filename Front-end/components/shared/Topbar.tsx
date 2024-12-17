'use client';
import { logoutUser } from '@/apis/auth';
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
} from '@/components/ui/alert-dialog';
import useTriggerStore from '@/store/useTriggerStore';
import useUserStore from '@/store/useUserStore';
import {
  Flag,
  LinkIcon,
  Slack as Logo,
  LogOut,
  LogOutIcon,
  Save,
  Settings,
  UserMinus,
  VolumeX,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
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
function Topbar() {
  const { LeftSidebarOpened } = useTriggerStore();
  const avatarUrl = useUserStore((state) => state.user?.profilePic);
  const logout = useUserStore((state) => state?.logout);
  const pathname = usePathname();
  const isProfilePage = pathname.includes('/profile');
  const router = useRouter();
  const { mutate: mutatelogout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      if (data.success) {
        logout();
        router.push('./sign-in');
        toast({
          title: 'Logout Success',
        });
      }
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      const errMessage =
        error?.response?.data?.error || 'Server error, please try again later';
      errMessage(errMessage); // Set error message from API
    },
  });
  return (
    <nav className="fixed top-0 z-30 flex w-full items-center justify-between bg-light-1 px-8 py-5 shadow-xl dark:bg-dark-2 lg:bg-transparent lg:shadow-none">
      <Link href="/" className="flex items-center gap-4">
        <Logo className="relative m-auto size-9" />
        {LeftSidebarOpened && (
          <p className="text-3xl font-semibold dark:text-light-1 max-xs:hidden">
            Thread City
          </p>
        )}
      </Link>

      <div className="flex items-center gap-1">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="block md:hidden">
              <div
                onClick={() => mutatelogout()}
                className="flex cursor-pointer"
              >
                <LogOutIcon className="size-6" />
              </div>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có chắc chắn muốn đăng xuất không?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Bạn sẽ bị đăng xuất khỏi tài khoản của mình. Mọi tiến trình chưa
                lưu có thể sẽ bị mất.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={() => mutatelogout()}>
                Đăng xuất
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {!isProfilePage && (
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="flex items-center border-none bg-transparent p-2 transition-all duration-150 hover:border-[#e1e1e1] focus:outline-none focus:ring-2 focus:ring-white active:scale-95 data-[state=open]:border-[#e1e1e1]">
                <Avatar>
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    <AvatarImage
                      src={
                        'https://res.cloudinary.com/muckhotieu/image/upload/v1731805369/l60Hf_ztxub0.png'
                      }
                    />
                  </AvatarFallback>
                </Avatar>
              </MenubarTrigger>
              <MenubarContent align="end">
                <MenubarItem className="flex cursor-default items-center justify-between py-2">
                  Save
                  <MenubarShortcut>⌘CTRL + S</MenubarShortcut>
                  <Save className="ml-2 size-4 " />
                </MenubarItem>

                <MenubarSeparator />

                <MenubarItem className="flex cursor-default items-center justify-between py-2">
                  Mute
                  <VolumeX className="ml-2 size-4  cursor-pointer" />
                </MenubarItem>

                <MenubarItem className="flex cursor-default items-center justify-between py-2">
                  Block
                  <UserMinus className="ml-2 size-4  cursor-pointer" />
                </MenubarItem>

                <MenubarItem className="flex cursor-default items-center justify-between py-2">
                  Report
                  <Flag className="ml-2 size-4  cursor-pointer" />
                </MenubarItem>

                <MenubarSeparator />

                <Link href={'./settings/profile'}>
                  <MenubarItem className="flex cursor-default items-center justify-between py-2">
                    Settings
                    <Settings className="ml-2 size-4  cursor-pointer" />
                  </MenubarItem>
                </Link>
                <MenubarItem className="flex cursor-default items-center justify-between py-2">
                  Log out
                  <LogOut className="ml-2 size-4  cursor-pointer" />
                </MenubarItem>

                <MenubarSeparator />

                <MenubarItem
                  onClick={() => {
                    /* Logic for copying link */
                  }}
                  className="flex cursor-default items-center justify-between py-2"
                >
                  Copy link
                  <LinkIcon className="ml-2 size-4  cursor-pointer" />
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
      </div>
    </nav>
  );
}

export default Topbar;
