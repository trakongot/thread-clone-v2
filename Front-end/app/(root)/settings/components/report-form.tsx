'use client';
import { fetchSearchSuggestions } from '@/apis/search';
import { reportUser } from '@/apis/user';
import { Button } from '@/components/custom/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useQuery } from 'react-query';

export default function ReportForm({ onReportSubmit }: any) {
  const [search, setSearch] = useState<string>(''); // Từ khóa tìm kiếm user
  const [selectedUser, setSelectedUser] = useState<any>(null); // Người dùng được chọn
  const [reason, setReason] = useState<string>(''); // Lý do báo cáo
  const [description, setDescription] = useState<string>(''); // Mô tả
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // Trạng thái gửi
  const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading

  // Sử dụng react-query để lấy gợi ý user
  const { data: userSuggestions = [], isFetching } = useQuery(
    ['searchSuggestions', search],
    () => fetchSearchSuggestions(search),
    {
      enabled: !!search, // Chỉ fetch khi search không rỗng
      staleTime: 5 * 60 * 1000, // Cache trong 5 phút
      refetchOnWindowFocus: false, // Không tự động fetch khi focus lại cửa sổ
    },
  );

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setSearch(''); // Reset search sau khi chọn
  };

  const handleReportSubmit = async () => {
    if (!selectedUser || !reason) {
      alert('Please select a user and reason for the report.');
      return;
    }

    // Hiển thị cửa sổ xác nhận trước khi gửi báo cáo
    const isConfirmed = window.confirm(
      `Bạn chắc chắn muốn report ${selectedUser.name} (@${selectedUser.username}) vì lí do: ${reason}?`,
    );

    if (isConfirmed) {
      try {
        setIsLoading(true);
        const response = await reportUser({
          reportedUserId: selectedUser._id,
          reason,
          description,
        });

        console.log('Report submitted:', response);

        // Hiển thị thông báo cảm ơn
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);

        // Reset form
        setSelectedUser(null);
        setReason('');
        setDescription('');

        if (onReportSubmit) onReportSubmit(); // Call the parent callback
      } catch (error) {
        console.error('Error submitting report:', error);
        alert('An error occurred while submitting the report.');
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Report submission cancelled');
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md space-y-4">
      <div className="text-xl font-semibold">Report User Violation</div>

      {/* Hiển thị thông báo cảm ơn */}
      {isSubmitted && (
        <div className="p-2 text-green-700 bg-green-100 border border-green-300 rounded-md">
          Cảm ơn vì phản hồi của bạn!
        </div>
      )}

      {/* Input tìm kiếm user */}
      <div className="relative my-3">
        <Label className="mb-2 block text-sm font-medium text-gray-700">
          Username of the User to Report
        </Label>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a user"
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {/* Gợi ý user */}
        {isFetching ? (
          <div className="absolute mt-1 text-sm text-gray-500">Loading...</div>
        ) : (
          search &&
          userSuggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-md">
              {userSuggestions.map((user: any) => (
                <li
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className="flex cursor-pointer items-center gap-2 p-2 hover:bg-gray-100"
                >
                  <Avatar className="size-7">
                    <AvatarImage src={user.profilePic} alt="avatar" />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-gray-500">@{user.username}</span>
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>

      {/* Thông tin người dùng được chọn */}
      {selectedUser && (
        <div className="p-4 rounded-md border border-gray-300 bg-gray-50 shadow-sm">
          <p>
            <strong>Selected User:</strong> {selectedUser.name} (@
            {selectedUser.username})
          </p>
        </div>
      )}

      {/* Chọn lý do */}
      <div className="my-3">
        <Label className="mb-2 block text-sm font-medium text-gray-700">
          Select a Reason for Reporting
        </Label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2"
        >
          <option value="">Choose a reason</option>
          <option value="spam">Spam</option>
          <option value="harassment">Harassment</option>
          <option value="inappropriate-content">Inappropriate Content</option>
          <option value="misleading-info">Misleading Information</option>
        </select>
      </div>

      {/* Thêm mô tả */}
      <div>
        <Label className="block text-sm font-medium text-gray-700">
          Add Description (optional)
        </Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the violation"
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Nút gửi */}
      <div className="flex justify-end">
        <Button
          onClick={handleReportSubmit}
          className="bg-red-500 text-white"
          disabled={!selectedUser || !reason || isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  );
}
