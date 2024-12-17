import { Notification } from '@/types/notificationType';
import { Socket, io } from 'socket.io-client';
import { create } from 'zustand';


interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  isConnected: boolean;
  notifications: Notification[];
  unreadCount: number;
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
  setNotifications: (
    notifications: Notification[],
    unreadCount: number,
  ) => void;
  markAllAsRead: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],
  isConnected: false,
  notifications: [],
  unreadCount: 0,

  connectSocket: (userId: string) => {
    const { socket } = get();
    if (socket) {
      return;
    }

    const newSocket = io('http://localhost:4000', {
      query: { userId },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      set({ socket: newSocket, isConnected: true });
    });

    newSocket.on('getOnlineUsers', (users) => {
      set({ onlineUsers: users });
    });

    newSocket.on('notification', (notification: Notification) => {
      set((state) => {
        const updatedNotifications = [notification, ...state.notifications];
        return {
          notifications: updatedNotifications,
          unreadCount: state.unreadCount + 1,
        };
      });
    });

    newSocket.on('newMessage', (message) => {});
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [], isConnected: false });
    }
  },

  setNotifications: (notifications: Notification[], unreadCount: number) => {
    set((state) => {
      const updatedNotifications = [...state.notifications, ...notifications];
      return {
        notifications: updatedNotifications,
        unreadCount,
      };
    });
  },

  markAllAsRead: () => {
    set({ unreadCount: 0 });
  },
}));
