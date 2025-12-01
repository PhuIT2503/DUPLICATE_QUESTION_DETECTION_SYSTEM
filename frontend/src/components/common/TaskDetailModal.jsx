import React from "react";
import { 
  XMarkIcon, 
  CalendarDaysIcon, 
  DocumentTextIcon, 
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

const TaskDetailModal = ({ task, onClose }) => {
  if (!task) return null;

  const getStatusColor = () => {
    if (task.completed) return "bg-green-100 text-green-800";
    
    const now = new Date();
    const deadline = new Date(task.deadline);
    const timeDiff = deadline - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return "bg-red-100 text-red-800"; // Quá hạn
    if (daysDiff <= 1) return "bg-yellow-100 text-yellow-800"; // Sắp đến hạn
    return "bg-blue-100 text-blue-800"; // Bình thường
  };

  const getStatusText = () => {
    if (task.completed) return "Hoàn thành";
    
    const now = new Date();
    const deadline = new Date(task.deadline);
    const timeDiff = deadline - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return "Quá hạn";
    if (daysDiff <= 1) return "Sắp đến hạn";
    return "Đang thực hiện";
  };

  const getStatusIcon = () => {
    if (task.completed) return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
    
    const now = new Date();
    const deadline = new Date(task.deadline);
    const timeDiff = deadline - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return <XCircleIcon className="h-6 w-6 text-red-600" />;
    if (daysDiff <= 1) return <ClockIcon className="h-6 w-6 text-yellow-600" />;
    return <ClockIcon className="h-6 w-6 text-blue-600" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getDaysUntilDeadline = () => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    const timeDiff = deadline - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return `Đã quá hạn ${Math.abs(daysDiff)} ngày`;
    if (daysDiff === 0) return "Đến hạn hôm nay";
    if (daysDiff === 1) return "Đến hạn ngày mai";
    return `Còn ${daysDiff} ngày`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              {getStatusIcon()}
              <div>
                <h2 className="text-2xl font-bold mb-2">{task.taskName}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Task Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                    <p className="font-medium">{formatDate(task.startDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Hạn chót</p>
                    <p className="font-medium">{formatDate(task.deadline)}</p>
                    <p className="text-sm text-gray-600">{getDaysUntilDeadline()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {task.subject && (
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Môn học</p>
                      <p className="font-medium">{task.subject.name}</p>
                    </div>
                  </div>
                )}

                {task.assignedBy && (
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Được giao bởi</p>
                      <p className="font-medium">Người giao nhiệm vụ</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Mô tả nhiệm vụ</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                </div>
              </div>
            )}

            {/* Progress */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Tiến độ</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {task.completed ? "Hoàn thành" : "Đang thực hiện"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {task.completed ? "100%" : "0%"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      task.completed ? "bg-green-600" : "bg-blue-600"
                    }`}
                    style={{ width: task.completed ? "100%" : "0%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <div className="text-sm text-gray-500">
                <p>Tạo lúc: {formatDate(task.createdAt || task.startDate)}</p>
                {task.updatedAt && (
                  <p>Cập nhật lúc: {formatDate(task.updatedAt)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
