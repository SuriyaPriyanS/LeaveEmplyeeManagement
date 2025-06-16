import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Adjust as needed

export const userService = {
  register: async (userData) => {
    const res = await axios.post(`${API_URL}/register`, userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await axios.post(`${API_URL}/login`, credentials);
    return res.data;
  }
};

