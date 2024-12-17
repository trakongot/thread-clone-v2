import axiosClient from '@/lib/userApi';
import { Report } from '@/types/reportType';
import { Thread } from '@/types/threadType';
import { User } from '@/types/userType';

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosClient.get(`/admin/users`);

    // Check for any error in the response
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    // Return the list of users
    return response.data.users as User[];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

export const getAllReports = async ({ page }): Promise<Report[]> => {
  try {
    const response = await axiosClient.get(`/report`, {
      params: { page },
    });
    // Check for any error in the response
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    // Return the list of users
    console.log(response.data.reports, 'test');
    return response.data as Report[];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

export const getReportById = async ({
  id,
}: {
  id: string;
}): Promise<Report> => {
  try {
    const response = await axiosClient.get(`/report/getReport/${id}`);
    // Chú ý không được dùng như này   bởi vì sẽ nhầm lẫn sang cái api trên và nó trả về all report
    // const response = await axiosClient.get(`/report/reports`, {
    //     params: { id },
    //     });

    // Check for any error in the response
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    console.log(response,"00000");
    // Return the list of users
    return response.data.report as Report;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};
export const getReportsBySearch = async ({
  page,
  searchText,
}): Promise<Report[]> => {
  try {
    const response = await axiosClient.get(`/report/search`, {
      params: { page, searchText },
    });

    // Check for any error in the response
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    // Return the list of users
    console.log(response.data.reports, 'test');
    return response.data as Report[];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};
export const updateReportStatus = async ({
  currentStatus,
  newStatus,
  reportId,
  data,
}: {
  currentStatus: string;
  newStatus: string;
  reportId: string;
  data: object;
}): Promise<{ messesage: string }> => {
  try {
    const response = await axiosClient.put(`/report/status`, {
      currentStatus,
      newStatus,
      reportId,
      data,
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data as { messesage: string };
  } catch (error) {
    console.error('Error in followOrUnfollowThread:', error);
    throw error;
  }
};

export const getAllThreads = async (): Promise<Thread[]> => {
  try {
    const response = await axiosClient.get(`/admin/threads`);

    if (response.data.error) {
      throw new Error(response.data.error);
    }
    console.log(response.data,"kjfdhjfgdjfg");
    return response.data.threads as Thread[];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

export const getThreadById = async ({
  id,
}: {
  id: string;
}): Promise<Thread> => {
  try {
    const response = await axiosClient.get(`admin/threads/${id}`);

    if (response.data.error) {
      throw new Error(response.data.error);
    }
    // Return the list of users
    console.log(response.data,"akdladklfsdlkfsdlkfdf");
    return response.data as Thread;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};
