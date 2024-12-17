import Notification from '../models/notificationModel.js';

// Lấy danh sách thông báo
export const getNotificationsService = async (
  userId,
  pageNumber = 1,
  pageSize = 5,
) => {
  try {
    const notifications = await Notification.find({ recipient: userId })
      .populate({
        path: 'sender',
        select: '_id name profilePic username',
      })
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian mới nhất
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalNotifications = await Notification.countDocuments({
      recipient: userId,
    });

    const totalPages = Math.ceil(totalNotifications / pageSize);
    const isNext = pageNumber < totalPages;

    return {
      notifications,
      totalNotifications,
      pageNumber,
      isNext,
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Could not fetch notifications');
  }
};
// Cập nhật thông báo đã đọc
// Cập nhật thông báo đã đọc cho mảng ID và kiểm tra userId
export const markNotificationsAsReadService = async (
  notificationIds,
  userId,
) => {
  try {
    // Kiểm tra các thông báo có tồn tại và có sender trùng với userId không
    const notifications = await Notification.find({
      _id: { $in: notificationIds },
      sender: userId, // Kiểm tra sender trùng với userId
    });

    if (notifications.length === 0) {
      throw new Error('No notifications found or user is not the sender');
    }

    // Cập nhật thông báo đã đọc
    const updatedNotifications = await Notification.updateMany(
      { _id: { $in: notificationIds }, sender: userId },
      { $set: { isRead: true } },
      { new: true },
    );

    if (updatedNotifications.nModified === 0) {
      throw new Error('No notifications updated');
    }

    return updatedNotifications;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw new Error('Could not mark notifications as read');
  }
};

/**
 * Tạo thông báo
 * @param {Object} notificationData - Dữ liệu thông báo cần tạo
 * @returns {Promise<Object>} - Thông báo vừa được tạo
 */
export const createNotificationService = async (notificationData) => {
  try {
    const newNotification = new Notification(notificationData);
    const savedNotification = await newNotification.save();
    return savedNotification;
  } catch (error) {
    console.error('Error in createNotificationService:', error);
    throw new Error('Could not create notification');
  }
};
