import React, { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useNotification } from "../../contexts/NotificationContext";

const NotificationBell = () => {
  const { notifications, markAsRead, deleteNotification, fetchNotifications } = useNotification();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Tự động làm mới thông báo mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 giây

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <div className="relative">
      <button
        className="relative text-gray-600 hover:text-black"
        onClick={() => setOpen(!open)}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b font-semibold">Thông báo</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm">Không có thông báo.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${n.isRead ? "text-gray-600" : "font-semibold text-black"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div>{n.title}</div>
                    <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                    <div className="text-sm text-gray-700">{n.message}</div>
                  </div>
                  <button onClick={() => deleteNotification(n.id)}>
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                {!n.isRead && (
                  <button
                    className="mt-1 text-xs text-teal-600 hover:underline"
                    onClick={() => markAsRead(n.id)}
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
