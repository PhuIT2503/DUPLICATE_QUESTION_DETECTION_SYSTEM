// NotificationContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { notificationAPI, setupNotificationWebSocket } from '../services/NotificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await notificationAPI.getAll(user.id);
      setNotifications(data);
      updateUnreadCount(data);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const updateUnreadCount = (notifs) => {
    const count = notifs.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err.message);
    }
  };

  // Load notifications khi user thay đổi
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id]);

  // Thiết lập WebSocket khi user thay đổi
  useEffect(() => {
    if (user?.id) {
      const cleanup = setupNotificationWebSocket(user.id, (newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return cleanup;
    }
  }, [user?.id]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications: loadNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification: async (id) => {
          try {
            await notificationAPI.delete(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            setUnreadCount(prev => prev - 1);
          } catch (err) {
            setError(err.message);
          }
        }
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification phải được dùng trong NotificationProvider');
  }
  return context;
}
