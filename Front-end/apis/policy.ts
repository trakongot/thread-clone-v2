import axiosClient from '@/lib/userApi';

type PolicyListResponse = {
  success: boolean;
  policies: any[];
  isNext: boolean;
  filter: string;
};
export const getPolicies = async ({
  pageNumber = 1,
  pageSize = 20,
  filter = '',
}): Promise<PolicyListResponse> => {
  const response = await axiosClient.get('/policies/', {
    params: { pageNumber, pageSize, filter },
  });
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as PolicyListResponse;
};
export const getPolicyById = async ({ id }: { id: string }): Promise<any> => {
  if (!id) throw new Error('Policy ID is required');
  const response = await axiosClient.get(`/policies/${id}`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as any;
};

// export const createPolicy = async ({
//     title,
//     content,
//     media,
// }: {
//     title: string;
//     content: string;
//     media?: File[];
// }): Promise<{
//     success: boolean;
//     message: string;
//     data?: object;
// }> => {
//     try {
//         const formData = new FormData();
//         formData.append("title", title);
//         formData.append("content", content);

//         if (media) {
//             media.forEach((file) => {
//                 formData.append("media", file);
//             });
//         }

//         // Gửi yêu cầu POST
//         const response = await axiosClient.post("/policies/createPolicy", formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         });

//         // Trả về dữ liệu từ server nếu thành công
//         return response.data;
//     } catch (error: any) {
//         // Xử lý lỗi nếu có
//         throw new Error(error.response?.data?.message || "Failed to create policy");
//     }
// };

export const createPolicy = async ({
  title,
  content,
  status = 'Active',
}: {
  title: string;
  content: string;
  status?: string;
}): Promise<any> => {
  try {
    const response = await axiosClient.post('/policies', {
      title,
      content,
      // createdBy,
      status,
    });

    // Trả về kết quả nếu thành công
    return response.data as {
      success: boolean;
      message: string;
      data?: object;
    };
  } catch (error: any) {
    console.error('API Error:', error.response || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create policy');
  }
};

export const togglePolicyStatus = async ({
  id,
}: {
  id: string;
}): Promise<{
  success: boolean;
  message: string;
  updatedPolicy: {
    _id: string;
    title: string;
    createdBy?: { name?: string; email?: string };
    status: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  };
}> => {
  if (!id) {
    throw new Error('Policy ID is required');
  }
  const response = await axiosClient.patch(`/policies/${id}`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data as {
    success: boolean;
    message: string;
    updatedPolicy: {
      _id: string;
      title: string;
      createdBy?: { name?: string; email?: string };
      status: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
};
