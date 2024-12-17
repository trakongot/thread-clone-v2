import dashbroadRoutes from '../routes/dashboardRouter.js';
import messageRoutes from '../routes/messageRoutes.js';
import notificationRoutes from '../routes/notificationRoutes.js';
import policyRoutes from '../routes/policyRoutes.js';
import searchRoutes from '../routes/searchRoutes.js';
import threadRoutes from '../routes/threadRoutes.js';
import userRoutes from '../routes/userRoutes.js';

/**
 * Cấu hình các route cho ứng dụng
 */
const configureRoutes = (app) => {
  app.use('/api/users', userRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/threads', threadRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/policies', policyRoutes);
  app.use('/api/dashboard', dashbroadRoutes);
};

export default configureRoutes;
