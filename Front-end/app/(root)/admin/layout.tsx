'use client';
import { Calendar, Inbox, Search, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { DashboardIcon } from '@radix-ui/react-icons';
const items = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: DashboardIcon,
  },
  {
    title: 'Report Management',
    url: '/admin/reports',
    icon: Inbox,
  },
  {
    title: 'Threads Management',
    url: '/admin/threads',
    icon: Calendar,
  },
  {
    title: 'Users Management',
    url: '/admin/users',
    icon: Search,
  },
  {
    title: 'Policy Management',
    url: '/admin/policy',
    icon: Settings,
  },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>UTC Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="h-full w-screen">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
