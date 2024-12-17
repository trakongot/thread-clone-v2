import {
  createNotificationService,
  getNotificationsService,
  markNotificationsAsReadService,
} from '../services/notificationService.js';

// Lấy thông báo có phân trang
export const getNotifications = async (req, res) => {
  const userId = req.user.id;
  const { pageNumber = 1, pageSize = 10 } = req.query;

  try {
    const notificationsData = await getNotificationsService(
      userId,
      pageNumber,
      pageSize,
    );
    return res.status(200).json(notificationsData);
  } catch (error) {
    console.error('Error in getNotificationsController:', error);
    return res.status(500).json({ message: 'Error fetching notifications' });
  }
};

// Cập nhật thông báo là đã đọc
export const markNotificationAsRead = async (req, res) => {
  const { notificationIds } = req.body;
  const userId = req?.user?._id;
  try {
    const updatedNotification = await markNotificationsAsReadService(
      notificationIds,
      userId,
    );
    return res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error in markNotificationAsReadController:', error);
    return res
      .status(500)
      .json({ message: 'Error marking notification as read' });
  }
};

export const createNotification = async (req, res) => {
  const { recipient, sender, type, entityId, entityModel, message } = req.body;

  if (!recipient || !sender || !type || !entityId || !entityModel || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const notificationData = {
      recipient,
      sender,
      type,
      entityId,
      entityModel,
      message,
      isRead: false,
    };

    const createdNotification = await createNotificationService(
      notificationData,
    );

    return res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification: createdNotification,
    });
  } catch (error) {
    console.error('Error in createNotificationController:', error);
    return res.status(500).json({ message: 'Error creating notification' });
  }
};
