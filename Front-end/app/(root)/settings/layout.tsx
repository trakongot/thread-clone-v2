'use client';

import { Layout } from '@/components/custom/layout';
import Bottombar from '@/components/shared/Bottombar';
import LeftSidebar from '@/components/shared/LeftSidebar';
import ThemeSwitch from '@/components/theme-switch';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { UserNav } from '@/components/user-nav';
import {
  IconNotification,
  IconPalette,
  IconReport,
  IconUser,
} from '@tabler/icons-react';
import type { Metadata } from 'next';
import SidebarNav from './components/sidebar-nav';
export const metadata: Metadata = {
  title: 'Threads',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex flex-row">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col items-center bg-light-2 px-6 pb-10 pt-3 dark:bg-dark-1 max-md:pb-32 sm:px-10">
          <div className="w-full">
            <Layout fixed>
              {/* ===== Top Heading ===== */}
              <Layout.Header>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="md:w-[100px] lg:w-[300px]"
                />
                <div className="ml-auto flex items-center space-x-4">
                  <ThemeSwitch />
                  <UserNav />
                </div>
              </Layout.Header>

              <Layout.Body className="flex flex-col">
                <div className="space-y-0.5">
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Cài đặt và quyền riêng tư
                  </h1>
                  <p className="text-muted-foreground">
                    Quản lý các cài đặt tài khoản của bạn và tùy chỉnh các sở
                    thích về email để nhận thông tin phù hợp nhất với bạn.
                  </p>
                </div>
                <Separator className="my-4 lg:my-6" />
                <div className="flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0">
                  <aside className="top-0 lg:sticky lg:w-1/5">
                    <SidebarNav items={sidebarNavItems} />
                  </aside>
                  <ScrollArea className="flex h-[500px] w-full p-1 pr-4 md:overflow-y-hidden">
                    {children}
                  </ScrollArea>
                </div>
              </Layout.Body>
            </Layout>
          </div>
        </section>
      </main>
      <Bottombar />
      <Toaster />
    </>
  );
}

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <IconUser size={18} />,
    href: '/profile/edit',
  },
  // {
  //   title: "Account",
  //   icon: <IconTool size={18} />,
  //   href: "/settings/account",
  // },
  {
    title: 'Hỏi đáp',
    icon: <IconPalette size={18} />,
    href: '/settings/faq',
  },
  {
    title: 'Chính sách',
    icon: <IconPalette size={18} />,
    href: '/settings/policy',
  },
  {
    title: 'Liên hệ',
    icon: <IconNotification size={18} />,
    href: '/settings/contact-us',
  },
  {
    title: 'Báo cáo',
    icon: <IconReport size={18} />,
    href: '/settings/report',
  },
];
