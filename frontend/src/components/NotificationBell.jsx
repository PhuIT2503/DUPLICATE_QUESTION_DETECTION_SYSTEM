import { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { FaBell } from 'react-icons/fa';
import NotificationList from './NotificationList';

export default function NotificationBell() {
  const { unreadCount, markAllAsRead, loadNotifications } = useNotification(); // ✅ Thêm loadNotifications
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (unreadCount > 0 && !isOpen) {
      setHasNew(true);
      const timer = setTimeout(() => setHasNew(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount, isOpen]);

  const toggleNotifications = () => {
    const newOpenState = !isOpen;
    setIsOpen(newOpenState);

    if (newOpenState) {
      // ✅ Khi mở dropdown -> tải lại thông báo
      loadNotifications();
    } else if (unreadCount > 0) {
      // ✅ Khi đóng dropdown -> đánh dấu đã đọc
      markAllAsRead();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className={`p-2 rounded-full relative ${hasNew ? 'animate-pulse' : ''}`}
        aria-label="Notifications"
      >
        <FaBell className="text-xl text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <NotificationList />
        </div>
      )}
    </div>
  );
}
