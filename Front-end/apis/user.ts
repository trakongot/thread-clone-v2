import axiosClient from '@/lib/userApi';
import { User } from '@/types/userType';

export const updateUser = async ({
  name,
  username,
  bio,
  img,
}: {
  name: string;
  username: string;
  bio: string;
  img: File | null;
}): Promise<User> => {
  const formData = new FormData();

  formData.append('name', name);
  formData.append('username', username);
  formData.append('bio', bio);
  if (img) formData.append('img', img);

  const response = await axiosClient.put(`/users/`, formData);
  if (response.data.error) throw new Error(response.data.error);

  return response.data as User;
};

export const updateUserOnboarded = async ({
  name,
  username,
  bio,
  img,
}: {
  name: string;
  username: string;
  bio: string;
  img: File | null;
}): Promise<{ user: User }> => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('username', username);
  formData.append('bio', bio);
  if (img) formData.append('img', img);

  const response = await axiosClient.post(`/users/onboarded`, formData);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as { user: User };
};
export const getUserById = async ({ id }: { id: string }): Promise<User> => {
  const response = await axiosClient.get(`/users/${id}`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as User;
};
export const getUserByCookies = async (): Promise<User> => {
  const response = await axiosClient.get(`/users`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as User;
};

// API báo cáo người dùng
export const reportUser = async ({
  reportedUserId,
  reason,
  description,
}: {
  reportedUserId: string;
  reason: string;
  description: string;
}) => {
  try {
    const response = await axiosClient.post('/report/user', {
      reportedUserId,
      reason,
      description,
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data; // Trả về dữ liệu phản hồi
  } catch (error) {
    console.error('Error in Report user:', error);
    throw error;
  }
};

export const top10FollowersUser = async (): Promise<User[]> => {
  const response = await axiosClient.get(`/users/suggested/top4FollowersUser`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data.users as User[];
};

export const usersIamFollowing = async (): Promise<User[]> => {
  const response = await axiosClient.get(`/users/suggested/usersIamFollow`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data.following as User[];
};
