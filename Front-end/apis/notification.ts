import axiosClient from '@/lib/userApi';
import { Notification } from '@/types/notificationType';

type NotificationListResponse = {
  notifications: Notification[];
  totalNotifications: number;
  pageNumber: number;
  isNext: boolean;
};

export const getNotifications = async ({
  pageNumber = 1,
  pageSize = 5,
}): Promise<NotificationListResponse> => {
  const response = await axiosClient.get('/notifications/', {
    params: { pageNumber, pageSize },
  });
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as NotificationListResponse;
};
