import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leave'; // Adjust as needed

// Optionally, add token to headers if using JWT
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const leaveService = {
  applyLeave: async (leaveData) => {
    const res = await axios.post(`${API_URL}/apply`, leaveData, getAuthHeaders());
    return res.data;
  },
  getLeaveHistory: async () => {
    const res = await axios.get(`${API_URL}/history`, getAuthHeaders());
    return res.data;
  },
  getAllLeaves: async () => {
    const res = await axios.get(`${API_URL}/all`, getAuthHeaders());
    return res.data;
  },
  updateLeaveStatus: async (id, status) => {
    const res = await axios.put(`${API_URL}/status/${id}`, { status }, getAuthHeaders());
    return res.data;
  },

  deleteLeave: async (id) => {
    const res = await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
    return res.data;
  },
};