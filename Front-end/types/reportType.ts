export type Report = {
  _id: string;
  reportedBy: string;
  content: string;
  contentType: 'Thread' | 'User';
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
};
