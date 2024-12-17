import express from 'express';

import { getAllThreads, getAllUsers } from '../controllers/userController.js';
import { authorize } from '../middlewares/authMiddleware.js';
import { getThreadById } from '../controllers/threadController.js';

const router = express.Router();

router.get('/users', authorize({ minRole: 'user' }), getAllUsers);
router.get('/threads', authorize({ minRole: 'user' }), getAllThreads);
router.get('/threads/:id', authorize({ minRole: 'user' }), getThreadById);

export default router;
