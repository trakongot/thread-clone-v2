export type Thread = {
  _id: string;
  postedBy: {
    _id: string;
    name: string;
    username: string;
    profilePic: string;
    bio: string;
    isFollowed: boolean;
    followerCount: number;
  };
  text: string;
  media: string[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  repostCount: number;
  parentId: string | null;
  isHidden: boolean;
  createdAt: string;
  isFollowed?: boolean;
  likes: [string];
  isLiked: boolean;
};
export type ThreadsListResponse = {
  success: boolean;
  threads: Thread[];
  isNext: boolean;
};