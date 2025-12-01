import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function NotificationItem({ notification, onMarkAsRead }) {
  const [isRead, setIsRead] = useState(notification.read);

  const handleClick = () => {
    if (!isRead) {
      onMarkAsRead(notification.id);
      setIsRead(true);
    }
    // Xử lý điều hướng khi click vào thông báo
  };

  return (
    <li
      onClick={handleClick}
      className={`p-3 hover:bg-gray-50 cursor-pointer ${!isRead ? 'bg-blue-50' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{notification.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        </div>
        {!isRead && (
          <span className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1"></span>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-2">
        {formatDistanceToNow(new Date(notification.createdAt), {
          addSuffix: true,
          locale: vi
        })}
      </div>
    </li>
  );
}