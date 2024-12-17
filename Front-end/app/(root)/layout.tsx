'use client';

import { useInitializeUser } from '@/hooks/useInitializeUser';

export default function Layout({ children }: { children: React.ReactNode }) {
  useInitializeUser();
  return <>{children}</>;
}
