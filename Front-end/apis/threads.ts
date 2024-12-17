import axiosClient from '@/lib/userApi';
import { Thread, ThreadsListResponse } from '@/types/threadType';

export const getThreads = async ({
  pageNumber = 1,
  pageSize = 20,
}): Promise<ThreadsListResponse> => {
  const response = await axiosClient.get('/threads/', {
    params: { pageNumber, pageSize },
  });
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as ThreadsListResponse;
};
export const getComments = async ({
  userId,
  pageNumber = 1,
  pageSize = 20,
}): Promise<ThreadsListResponse> => {
  if (!userId) {
    throw new Error('User ID is required to fetch comments.');
  }

  const response = await axiosClient.get(`/users/comments/${userId}/`, {
    params: { pageNumber, pageSize },
  });

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data as ThreadsListResponse;
};
export const getRepliesThread = async ({
  id,
  pageNumber = 1,
  pageSize = 20,
}: {
  id: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<ThreadsListResponse> => {
  if (!id) throw new Error('Thread ID is required');
  const response = await axiosClient.get(`/threads/${id}/replies`, {
    params: { pageNumber, pageSize },
  });
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as ThreadsListResponse;
};
export const getThreadById = async ({
  id,
}: {
  id: string;
}): Promise<Thread> => {
  if (!id) throw new Error('Thread ID is required');
  const response = await axiosClient.get(`/threads/${id}`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as Thread;
};
export const getThreadsByUser = async ({
  id,
  pageNumber = 1,
  pageSize = 20,
}: {
  id: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<ThreadsListResponse> => {
  if (!id) throw new Error('Thread ID is required');
  const response = await axiosClient.get(`/threads/${id}/byUser`, {
    params: { pageNumber, pageSize },
  });
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as ThreadsListResponse;
};
export const createThread = async ({
  text,
  media,
}: {
  text: string;
  media?: File[];
}): Promise<{ user: Thread }> => {
  const formData = new FormData();
  formData.append('text', text);
  if (media) media.forEach((item) => formData.append('media', item));
  const response = await axiosClient.post(`/threads`, formData);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as { user: Thread };
};
export const relyThread = async ({
  text,
  media,
  parentId,
}: {
  text: string;
  media?: File[];
  parentId: string;
}): Promise<{ user: Thread }> => {
  const formData = new FormData();
  formData.append('text', text);
  if (media) media.forEach((item) => formData.append('media', item));
  const response = await axiosClient.post(
    `/threads/${parentId}/replies`,
    formData,
  );
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as { user: Thread };
};
export const likeOrUnlikeThread = async ({
  id,
}: {
  id: string;
}): Promise<{
  success: boolean;
  message: string;
  likeCount: number;
}> => {
  if (!id) {
    throw new Error('Thread ID is required');
  }
  const response = await axiosClient.post(`/threads/${id}/like`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as {
    success: boolean;
    message: string;
    likeCount: number;
  };
};

export const deleteThread = async ({
  id,
}: {
  id: string;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!id) {
    throw new Error('Thread ID is required');
  }
  const response = await axiosClient.delete(`/threads/${id}`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as {
    success: boolean;
    message: string;
  };
};
