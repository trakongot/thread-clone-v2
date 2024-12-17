import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  createNotification
} from '../controllers/notificationController.js';
import { authorize } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/', authorize({ minRole: 'user' }), getNotifications);
router.post('/', authorize({ minRole: 'user' }), createNotification);
router.patch(
  '/mark-read',
  authorize({ minRole: 'user' }),
  markNotificationAsRead,
);

export default router;
