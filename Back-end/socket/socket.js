import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Notification from '../models/notificationModel.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingInterval: 25000,
  pingTimeout: 60000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Lưu trữ userId -> socketId
const userSocketMap = new Map();

// Lấy socketId của người nhận
export const getRecipientSocketId = (recipientId) => {
  return userSocketMap.get(recipientId);
};

// Middleware xử lý JSON payload
app.use(express.json());

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log('A user connected with ID:', socket.id);

  // Kiểm tra và cập nhật userId với socketId mới
  if (userId && userId !== 'undefined') {
    if (userSocketMap.has(userId)) {
      const oldSocketId = userSocketMap.get(userId);
      console.log(
        `User ${userId} is already connected. Updating socketId from ${oldSocketId} to ${socket.id}`,
      );

      // Tùy chọn: gửi thông báo ngắt kết nối cho socket cũ (nếu cần)
      io.to(oldSocketId).emit('forceDisconnect', {
        message: 'Your session has been updated. Disconnecting old connection.',
      });

      // Thực hiện cập nhật socketId mới
      userSocketMap.set(userId, socket.id);
    } else {
      // Thêm mới nếu chưa tồn tại
      userSocketMap.set(userId, socket.id);
    }
  }

  // Gửi danh sách người dùng online tới tất cả client
  io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));

  /**
   * Gửi thông báo trực tiếp qua Socket.IO
   */
  socket.on('notification', async (notificationData) => {
    try {
      // Gửi thông báo qua Socket.IO nếu người nhận online
      const recipientSocketId = getRecipientSocketId(notificationData.sender);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('notification', notificationData);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  });

  /**
   * Xử lý khi người dùng ngắt kết nối
   */
  socket.on('disconnect', () => {
    userSocketMap.forEach((value, key) => {
      if (value === socket.id) {
        console.log(`User ${key} with socketId ${value} has disconnected`);
        userSocketMap.delete(key);
      }
    });
    io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));
  });
});

/**
 * API gửi thông báo từ client
 */
app.post('/send-notification', async (req, res) => {
  const { recipient } = req.body;
  const notifications = await Notification.find({ recipient }).populate({
    path: 'sender',
    select: '_id name profilePic username',
  });

  // Gửi thông báo qua Socket.IO nếu người nhận online
  const recipientSocketId = getRecipientSocketId(recipient);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit('notification', notifications);
    return res
      .status(200)
      .json({ success: true, message: 'Notification sent successfully!' });
  } else {
    return res
      .status(200)
      .json({ error: `Recipient ${recipientId} is not online` });
  }
});

// Start server
server.listen(4000, () => {
  console.log('Server is running on port 4000');
});

export { app, io, server };
