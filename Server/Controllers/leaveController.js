import jwt from 'jsonwebtoken';
import Leave from '../Models/leave.js';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Validation middleware for apply leave (POST)
export const validateApplyLeave = (req, res, next) => {
  const { type, startDate, endDate, reason } = req.body;
  const errors = [];

  // Validate required fields
  if (!type || typeof type !== 'string' || type.trim() === '') {
    errors.push('Leave type is required and must be a non-empty string');
  }

  if (!startDate || typeof startDate !== 'string') {
    errors.push('Start date is required and must be a valid date string');
  }

  if (!endDate || typeof endDate !== 'string') {
    errors.push('End date is required and must be a valid date string');
  }

  if (!reason || typeof reason !== 'string' || reason.trim() === '') {
    errors.push('Reason is required and must be a non-empty string');
  }

  // Validate leave type
  const validTypes = ['Annual', 'Sick', 'Casual'];
  if (type && !validTypes.includes(type)) {
    errors.push('Leave type must be one of: Annual, Sick, Casual');
  }

  // Validate date formats
  if (startDate && isNaN(Date.parse(startDate))) {
    errors.push('Start date must be a valid date format');
  }

  if (endDate && isNaN(Date.parse(endDate))) {
    errors.push('End date must be a valid date format');
  }

  // Validate reason length
  if (reason && reason.trim().length > 500) {
    errors.push('Reason must not exceed 500 characters');
  }

  // Validate date logic
  if (startDate && endDate && !isNaN(Date.parse(startDate)) && !isNaN(Date.parse(endDate))) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      errors.push('Start date cannot be in the past');
    }

    if (end <= start) {
      errors.push('End date must be after start date');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
};

// Validation middleware for update status (PUT)
export const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  const errors = [];

  // Validate ID parameter
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    errors.push('Leave ID must be a valid positive number');
  }

  // Validate status
  if (!status || typeof status !== 'string' || status.trim() === '') {
    errors.push('Status is required and must be a non-empty string');
  }

  const validStatuses = ['pending', 'approved', 'rejected'];
  if (status && !validStatuses.includes(status.toLowerCase())) {
    errors.push('Status must be one of: pending, approved, rejected');
  }

  // Check admin role
  if (!req.user || req.user.role !== 'admin') {
    errors.push('Access denied. Admin role required to update leave status');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
};

// Validation middleware for delete leave (DELETE)
export const validateDeleteLeave = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  // Validate ID parameter
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    errors.push('Leave ID must be a valid positive number');
  }

  // Note: Role-based access will be checked in the controller function
  // as it may depend on business logic (user can delete own leaves, admin can delete any)

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
};

export const applyLeave = async (req, res) => {
  const { type, startDate, endDate, reason } = req.body;
  
  try {
    // Convert string dates to Date objects
    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
    
    const result = await Leave.create(req.user.id, type, formattedStartDate, formattedEndDate, reason);
    res.status(201).json({ 
      message: 'Leave applied successfully',
      leaveId: result.insertId 
    });
  } catch (err) {
    console.error('Error applying leave:', err.message);
    res.status(400).json({ error: err.message });
  }
};

export const getLeaveHistory = async (req, res) => {
  try {
    const leaves = await Leave.findByUserId(req.user.id);
    res.status(200).json(leaves);
  } catch (err) {
    console.error('Error fetching leave history:', err.message);
    res.status(500).json({ error: 'Failed to fetch leave history' });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    // Check if user is authenticated and is an admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Fetch all leaves
    const leaves = await Leave.findAll();
    return res.status(200).json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  
  try {
    const normalizedStatus = status.toLowerCase();
    console.log('Updating leave status:', { id, status: normalizedStatus });
    
    // Check if leave exists before updating
    const existingLeave = await Leave.findById(parseInt(id));
    if (!existingLeave) {
      return res.status(404).json({ error: 'Leave not found' });
    }

    const result = await Leave.updateStatus(parseInt(id), normalizedStatus);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Leave not found or no changes made' });
    }

    res.status(200).json({ 
      message: 'Leave status updated successfully',
      leaveId: id,
      newStatus: normalizedStatus
    });
  } catch (err) {
    console.error('Error updating leave status:', err.message);
    res.status(500).json({ error: 'Failed to update leave status' });
  }
};

export const deleteLeave = async (req, res) => {
  const { id } = req.params;
  
  try {
    const leaveId = parseInt(id);
    
    // Check if leave exists and get leave details
    const existingLeave = await Leave.findById(leaveId);
    if (!existingLeave) {
      return res.status(404).json({ error: 'Leave not found' });
    }

    // Authorization check: Admin can delete any leave, user can only delete their own
    if (req.user.role !== 'admin' && existingLeave.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You can only delete your own leave requests' });
    }

    // Additional business rule: Only pending leaves can be deleted
    if (existingLeave.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending leave requests can be deleted' });
    }

    const result = await Leave.delete(leaveId);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Leave not found or already deleted' });
    }

    res.status(200).json({ 
      message: 'Leave deleted successfully',
      leaveId: leaveId
    });
  } catch (err) {
    console.error('Error deleting leave:', err.message);
    res.status(500).json({ error: 'Failed to delete leave' });
  }
};
