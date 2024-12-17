'use client';

import { CreateThreadCard } from '@/components/cards/CreateThreadCard';
import ReportThreadCard from '@/components/cards/ReportCard';
import Bottombar from '@/components/shared/Bottombar';
import LeftSidebar from '@/components/shared/LeftSidebar';
import RightSidebar from '@/components/shared/RightSidebar';
import Topbar from '@/components/shared/Topbar';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import React from 'react';

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
      <Topbar />
      <main className="flex flex-row">
        <LeftSidebar />
        <section className="no-scrollbar flex min-h-screen flex-1 flex-col items-center bg-light-2 px-6 pb-10 pt-28 dark:bg-dark-1 max-md:pb-32 sm:px-10 md:pt-[26px]">
          <div className="w-full max-w-3xl">{children}</div>
        </section>
        <RightSidebar />
        <CreateThreadCard />
        <ReportThreadCard />
        <Toaster />
      </main>
      <Bottombar />
    </>
  );
}
