import axiosClient from '@/lib/userApi';
import { User } from '@/types/userType';

export const signinUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await axiosClient.post('/users/signin', {
    email,
    password,
  });
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as User;
};
export const signupUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await axiosClient.post('/users/signup', {
    email,
    password,
  });
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as User;
};
export const logoutUser = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await axiosClient.post('/users/logout');
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as {
    success: boolean;
    message: string;
  };
};

export const forgotPassword = async (email: string): Promise<void> => {
  const response = await axiosClient.post('/users/forgot-password', { email });
  if (response.data.error) throw new Error(response.data.error);
};
export const resetPassword = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}): Promise<void> => {
  const response = await axiosClient.post('/users/reset-password', {
    token,
    newPassword,
  });
  if (response.data.error) {
    throw new Error(response.data.error);
  }
};
