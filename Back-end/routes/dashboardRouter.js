import express from 'express';
import {
  getActiveUsers,
  getAreaChartNewUser,
  getBarChartNewThreads,
  getTotalComments,
  getTotalNewThreads,
  getTotalNewUser,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/barchartnewthreads', getBarChartNewThreads);
router.get('/totalnewuser', getTotalNewUser);
router.get('/totalnewthread', getTotalNewThreads);
router.get('/activeusers', getActiveUsers);
router.get('/totalcomment', getTotalComments);
router.get('/areachartnewuser', getAreaChartNewUser);
export default router;
