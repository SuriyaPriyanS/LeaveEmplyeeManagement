import express from 'express';
import { authenticate, applyLeave, getLeaveHistory, getAllLeaves, updateLeaveStatus, deleteLeave } from '../Controllers/leaveController.js';

const router = express.Router();

router.post('/apply', authenticate, applyLeave);
router.get('/history', authenticate, getLeaveHistory);
router.get('/all', authenticate, getAllLeaves);
router.put('/status/:id', authenticate, updateLeaveStatus);
router.delete('/delete/:id', authenticate, deleteLeave);

export default router;