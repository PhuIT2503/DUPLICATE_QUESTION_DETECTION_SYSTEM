import api from '../api/axiosapi';
import axios from 'axios';

// 1. Cấu hình Axios cơ bản
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. Interceptor để tự động thêm token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Các hàm API cho thông báo
export const notificationAPI = {
  // Lấy tất cả thông báo
  getAll: async (userId) => {
    try {
      const response = await apiClient.get(`/notifications?userId=${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Lỗi khi tải thông báo';
      console.error('Lỗi khi tải thông báo: ', errorMessage);
      throw new Error(errorMessage);
    }
  },

  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Lỗi khi đánh dấu đã đọc';
      console.error('Lỗi khi đánh dấu đã đọc: ', errorMessage);
      throw new Error(errorMessage);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.patch('/notifications/mark-all-read');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Lỗi khi đánh dấu tất cả';
      console.error('Lỗi khi đánh dấu tất cả: ', errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Xóa thông báo
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa thông báo');
    }
  }
};


export const setupNotificationWebSocket = (userId, callback) => {
  const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3000';
  const socket = new WebSocket(`${wsUrl}/notifications?userId=${userId}`);

  socket.onopen = () => console.log('Kết nối WebSocket thành công');

  socket.onmessage = (event) => {
    try {
      const notification = JSON.parse(event.data);
      callback(notification);
    } catch (error) {
      console.error('Lỗi phân tích thông báo:', error);
    }
  };

  socket.onerror = (error) => {
    console.error('Lỗi WebSocket:', error);
  };

  return () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  };
};

