export type Notification = {
  _id: string;
  recipient: {
    _id: string;
    name: string;
    username: string;
    profilePic: string;
  };
  sender: {
    _id: string;
    name: string;
    profilePic: string;
  };
  type: 'like' | 'comment' | 'follow' | 'mention' | 'repost' | 'system';
  entityId: string; // ID của đối tượng (Post, Comment, Thread, etc.)
  entityModel: 'Post' | 'Comment' | 'Thread'; // Loại đối tượng thông báo tham chiếu đến
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};
