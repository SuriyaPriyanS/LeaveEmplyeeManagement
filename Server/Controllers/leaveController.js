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

export const applyLeave = async (req, res) => {
  const {type, startDate, endDate, reason } = req.body;
  try {
    // Convert string dates to Date objects
    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
    
    await Leave.create(req.user.id, type, formattedStartDate, formattedEndDate, reason);
    res.status(201).json({ message: 'Leave applied' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getLeaveHistory = async (req, res) => {
  try {
    const leaves = await Leave.findByUserId(req.user.id);
    res.json(leaves);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    // Check if user is authenticated and is an admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Fetch all leaves
    const leaves = await Leave.findAll(); // Your custom query
    return res.status(200).json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateLeaveStatus = async (req, res) => {
  // if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  const status = req.body.status.toLowerCase();

  console.log('Updating leave status:', { id: req.params.id, status: 'Approved' });
  try {
    await Leave.updateStatus(req.params.id, status);
    res.status(200).json({ message: 'Status updated' });
  } catch (err) {
    res.status(200).json({ error: err.message });
  }
};

export const deleteLeave = async (req, res) => {
  //if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    await Leave.delete(req.params.id);
    res.json({ message: 'Leave deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};