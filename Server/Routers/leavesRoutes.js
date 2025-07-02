import express from 'express';
import { 
  authenticate, 
  applyLeave, 
  getLeaveHistory, 
  getAllLeaves, 
  updateLeaveStatus, 
  deleteLeave,
  validateApplyLeave,
  validateUpdateStatus,
  validateDeleteLeave
} from '../Controllers/leaveController.js';

const router = express.Router();

// Apply validation middleware to POST, PUT, and DELETE routes
router.post('/apply', authenticate, validateApplyLeave, applyLeave);
router.get('/history', authenticate, getLeaveHistory);
router.get('/all', authenticate, getAllLeaves);
router.put('/status/:id', authenticate, validateUpdateStatus, updateLeaveStatus);
router.delete('/delete/:id', authenticate, validateDeleteLeave, deleteLeave);

export default router;
