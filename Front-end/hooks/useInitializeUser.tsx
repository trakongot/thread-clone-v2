'use client';
import { getUserByCookies } from '@/apis/user';
import { useSocketStore } from '@/store/useSocketStore';
import useUserStore from '@/store/useUserStore';
import { useEffect } from 'react';

export const useInitializeUser = () => {
  const { setUser } = useUserStore();
  const { connectSocket } = useSocketStore();
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserByCookies();
      setUser(user);
      connectSocket(user._id);
    };
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
