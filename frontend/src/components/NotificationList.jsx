import { useNotification } from '@/contexts/NotificationContext'; // ✅ Sửa tên hook đúng
import NotificationItem from './NotificationItem';

export default function NotificationList() {
  const { 
    notifications, 
    loading, 
    error, 
    markAsRead,
    loadNotifications
  } = useNotification(); // ✅ Sửa lại đúng hook

  console.log("📬 Danh sách thông báo từ context:", notifications);

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold">Thông báo</h3>
        <button 
          onClick={loadNotifications}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Làm mới
        </button>
      </div>

      {loading ? (
        <div className="p-4 text-center">Đang tải...</div>
      ) : error ? (
        <div className="p-4 text-red-500 text-center">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">Không có thông báo</div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
