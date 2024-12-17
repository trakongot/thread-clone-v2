import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'contentType',
  },
  contentType: {
    type: String,
    enum: ['User', 'Thread'],
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  adminAction: {
    type: Array, // Đổi thành mảng kiểu String
    // enum: ["suspendAccount", "hideThread", "rejected", null], // Các giá trị có thể có trong mảng
    default: [], // Mặc định là mảng rỗng
  },

  adminNote: {
    type: String, // Ghi chú của admin, nếu có
    default: '',
  },
});

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;
