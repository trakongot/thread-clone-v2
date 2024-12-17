'use client';

import { getThreadById } from '@/apis/admin'; // API để lấy thông tin thread
import { Thread } from '@/types/threadType'; // Import kiểu dữ liệu Thread
import { useQuery } from 'react-query';

export default function ThreadDetailsPage({
  params,
}: Readonly<{ params: { threadId: string } }>) {
  const threadId = params.threadId; // Lấy threadId từ URL

  const {
    data: thread,
    isLoading,
    error,
  } = useQuery<Thread>({
    queryKey: ['thread', threadId],
    queryFn: () => getThreadById({ id: threadId }),
    enabled: !!threadId,
  });

  if (isLoading) return <p>Loading thread details...</p>;
  if (error) return <p>Error fetching thread details.</p>;
  console.log(thread, 'sdlifhsdukfhfskudfh');
  return (
    <section className="p-10">
      <h1 className="mb-4 text-xl font-bold">Thread Details</h1>

      {/* Basic Thread Information */}
      <div className="mb-6">
        <p>
          <strong>Thread ID:</strong> {thread?._id}
        </p>
        <p>
          <strong>Text:</strong> {thread?.text}
        </p>
        <p>
          <strong>Posted By:</strong> @{thread?.postedBy.username}
        </p>
        <p>
          <strong>Created At:</strong>{' '}
          {new Date(thread?.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Comment Count:</strong> {thread?.commentCount}
        </p>
        <p>
          <strong>Like Count:</strong> {thread?.likeCount}
        </p>
        <p>
          <strong>Repost Count:</strong> {thread?.repostCount}
        </p>
        <p>
          <strong>Share Count:</strong> {thread?.shareCount}
        </p>
        <p>
          <strong>Hidden:</strong> {thread?.isHidden ? 'Yes' : 'No'}
        </p>
      </div>

      {/* Images */}
      {thread?.imgs && thread.imgs.length > 0 && (
        <div className="mb-6">
          <p>
            <strong>Images:</strong>
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {thread.imgs.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thread Image ${index + 1}`}
                className="h-auto w-full rounded object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6">
        <button className="bg-blue-500 mr-2 rounded px-4 py-2 text-white">
          Edit Thread
        </button>
        <button className="rounded bg-red-500 px-4 py-2 text-white">
          Delete Thread
        </button>
      </div>

      {/* Children Threads */}
      {thread?.children && thread.children.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Replies:</h2>
          <ul className="mt-4 space-y-4">
            {thread.children.map((child) => (
              <li key={child._id} className="rounded border p-4 shadow">
                <p>
                  <strong>Posted By:</strong> @{child.postedBy.username}
                </p>
                <p>
                  <strong>Text:</strong> {child.text}
                </p>
                <p>
                  <strong>Created At:</strong>{' '}
                  {new Date(child.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
