/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: "Lấy danh sách thông báo với phân trang"
 *     description: "Trả về danh sách thông báo cho người dùng với phân trang, sử dụng page và limit để điều chỉnh kết quả."
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: page
 *         description: "Trang hiện tại (mặc định là 1)"
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: "Số lượng thông báo mỗi trang (mặc định là 10)"
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: "Danh sách thông báo của người dùng"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: "ID của thông báo"
 *                         example: "60c72b2f9a1d5f4f88e87f0d"
 *                       recipient:
 *                         type: string
 *                         description: "ID người nhận"
 *                         example: "60c72b2f9a1d5f4f88e87f0d"
 *                       sender:
 *                         type: string
 *                         description: "ID người gửi"
 *                         example: "60c72b2f9a1d5f4f88e87f0e"
 *                       type:
 *                         type: string
 *                         description: "Loại thông báo"
 *                         example: "like"
 *                       entityId:
 *                         type: string
 *                         description: "ID đối tượng liên quan"
 *                         example: "60c72b2f9a1d5f4f88e87f0c"
 *                       entityModel:
 *                         type: string
 *                         description: "Loại đối tượng"
 *                         example: "Post"
 *                       message:
 *                         type: string
 *                         description: "Nội dung thông báo"
 *                         example: "User1 liked your post"
 *                       isRead:
 *                         type: boolean
 *                         description: "Trạng thái đã đọc"
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: "Thời gian tạo thông báo"
 *                         example: "2024-12-12T12:00:00Z"
 *       500:
 *         description: "Lỗi khi lấy thông báo"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching notifications"
 */

/**
 * @swagger
 * /api/notifications/mark-read:
 *   post:
 *     summary: "Cập nhật các thông báo là đã đọc"
 *     description: "Chấp nhận một mảng ID thông báo và đánh dấu chúng là đã đọc cho người dùng."
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Danh sách các ID thông báo cần đánh dấu là đã đọc"
 *                 example: ["60c72b2f9a1d5f4f88e87f0d", "60c72b2f9a1d5f4f88e87f0e"]
 *     responses:
 *       200:
 *         description: "Thông báo đã được đánh dấu là đã đọc thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notifications marked as read"
 *                 updatedNotifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: "ID của thông báo"
 *                         example: "60c72b2f9a1d5f4f88e87f0d"
 *                       recipient:
 *                         type: string
 *                         description: "ID người nhận"
 *                         example: "60c72b2f9a1d5f4f88e87f0d"
 *                       sender:
 *                         type: string
 *                         description: "ID người gửi"
 *                         example: "60c72b2f9a1d5f4f88e87f0e"
 *                       type:
 *                         type: string
 *                         description: "Loại thông báo"
 *                         example: "like"
 *                       entityId:
 *                         type: string
 *                         description: "ID đối tượng liên quan"
 *                         example: "60c72b2f9a1d5f4f88e87f0c"
 *                       entityModel:
 *                         type: string
 *                         description: "Loại đối tượng"
 *                         example: "Post"
 *                       message:
 *                         type: string
 *                         description: "Nội dung thông báo"
 *                         example: "User1 liked your post"
 *                       isRead:
 *                         type: boolean
 *                         description: "Trạng thái đã đọc"
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: "Thời gian tạo thông báo"
 *                         example: "2024-12-12T12:00:00Z"
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ (mảng ID trống hoặc không đúng)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or empty notification IDs"
 *       404:
 *         description: "Không tìm thấy thông báo để cập nhật hoặc không có quyền truy cập"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No notifications found to update"
 *       500:
 *         description: "Lỗi khi cập nhật thông báo"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error marking notifications as read"
 */
/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a notification
 *     description: Create a new notification for a user.
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipient:
 *                 type: string
 *                 description: The ID of the user who will receive the notification.
 *                 example: "674f3df6b7b828fc32924ea6"
 *               sender:
 *                 type: string
 *                 description: The ID of the user who is sending the notification.
 *                 example: "60c72b2f9a1d5f4f88e87f0e"
 *               type:
 *                 type: string
 *                 description: The type of the notification (e.g., like, comment, mention, follow).
 *                 example: "like"
 *               entityId:
 *                 type: string
 *                 description: The ID of the entity related to the notification (e.g., post or comment).
 *                 example: "60c72b2f9a1d5f4f88e87f0c"
 *               entityModel:
 *                 type: string
 *                 description: The type of the entity (e.g., Post, Comment, User).
 *                 example: "Post"
 *               message:
 *                 type: string
 *                 description: The content of the notification.
 *                 example: "User1 liked your post"
 *     responses:
 *       201:
 *         description: Successfully created the notification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Notification created successfully."
 *                 notification:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the created notification.
 *                       example: "675aa2dfe4f3fa9260863abb"
 *                     recipient:
 *                       type: string
 *                       description: The ID of the recipient user.
 *                       example: "674f3df6b7b828fc32924ea6"
 *                     sender:
 *                       type: string
 *                       description: The ID of the sender user.
 *                       example: "60c72b2f9a1d5f4f88e87f0e"
 *                     type:
 *                       type: string
 *                       description: The type of notification.
 *                       example: "like"
 *                     entityId:
 *                       type: string
 *                       description: The ID of the related entity (e.g., post).
 *                       example: "60c72b2f9a1d5f4f88e87f0c"
 *                     entityModel:
 *                       type: string
 *                       description: The entity model type (e.g., Post).
 *                       example: "Post"
 *                     message:
 *                       type: string
 *                       description: The content of the notification.
 *                       example: "User1 liked your post"
 *                     isRead:
 *                       type: boolean
 *                       description: Whether the notification has been read.
 *                       example: false
 *       400:
 *         description: Bad Request, invalid input data.
 *       500:
 *         description: Internal Server Error.
 */
