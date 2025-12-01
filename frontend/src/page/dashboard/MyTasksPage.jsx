import React, { useState, useEffect } from "react";
import { 
  MagnifyingGlassIcon, 
  CalendarDaysIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentArrowUpIcon,
  FunnelIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import api from "../../api/axiosapi";
import TaskSubmissionPanel from "../../components/TaskSubmissionPanel";
import TaskDetailModal from "../../components/common/TaskDetailModal";
import { useAuth } from "../../contexts/AuthContext";

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSubmissionPanel, setShowSubmissionPanel] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchMyTasks();
    }
  }, [user]);

  const fetchMyTasks = async () => {
    if (!user?.id) {
      console.error("User ID not available:", user);
      setLoading(false);
      return;
    }
    
    try {
      console.log("Fetching tasks for user:", user.id, "Role:", user.role);
      // Giảng viên chỉ được xem nhiệm vụ của mình
      const res = await api.get("/assignments/my-tasks", {
        params: { userId: user.id }
      });
      console.log("Tasks response:", res.data);
      
      // Xử lý null safety và validate dữ liệu
      const validTasks = Array.isArray(res.data) ? res.data.filter(task => {
        if (!task || !task.taskName) {
          console.warn("Invalid task found:", task);
          return false;
        }
        return true;
      }).map(task => ({
        ...task,
        description: task.description || "",
        completed: task.completed || false,
        deadline: task.deadline || null,
        startDate: task.startDate || null
      })) : [];
      
      console.log("Valid tasks:", validTasks);
      setTasks(validTasks);
    } catch (err) {
      console.error("Không thể tải danh sách nhiệm vụ:", err);
      console.error("Error details:", err.response?.data);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmissions = (task) => {
    setSelectedTask(task);
    setShowSubmissionPanel(true);
  };

  const handleViewDetail = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleMarkCompleted = async (taskId) => {
    try {
      await api.post(`/assignments/${taskId}/complete`);
      fetchMyTasks();
      alert("Đã đánh dấu hoàn thành!");
    } catch (err) {
      console.error("Không thể đánh dấu hoàn thành:", err);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const getStatusColor = (task) => {
    if (!task) return "bg-gray-100 text-gray-800";
    
    if (task.completed) return "bg-green-100 text-green-800";
    
    if (!task.deadline) return "bg-blue-100 text-blue-800";
    
    const now = new Date();
    const deadline = new Date(task.deadline);
    
    if (isNaN(deadline.getTime())) return "bg-gray-100 text-gray-800";
    
    const timeDiff = deadline - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return "bg-red-100 text-red-800"; // Quá hạn
    if (daysDiff <= 1) return "bg-yellow-100 text-yellow-800"; // Sắp đến hạn
    return "bg-blue-100 text-blue-800"; // Bình thường
  };

  const getStatusText = (task) => {
    if (!task) return "Không xác định";
    
    if (task.completed) return "Hoàn thành";
    
    if (!task.deadline) return "Chưa có deadline";
    
    const now = new Date();
    const deadline = new Date(task.deadline);
    
    if (isNaN(deadline.getTime())) return "Deadline không hợp lệ";
    
    const timeDiff = deadline - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return "Quá hạn";
    if (daysDiff <= 1) return "Sắp đến hạn";
    return "Đang thực hiện";
  };

  const getStatusIcon = (task) => {
    if (task.completed) return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    
    const now = new Date();
    const deadline = new Date(task.deadline);
    const timeDiff = deadline - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return <XCircleIcon className="h-5 w-5 text-red-600" />;
    if (daysDiff <= 1) return <ClockIcon className="h-5 w-5 text-yellow-600" />;
    return <ClockIcon className="h-5 w-5 text-blue-600" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có ngày";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    return date.toLocaleDateString('vi-VN');
  };

  const filteredTasks = tasks.filter(task => {
    if (!task || !task.taskName) return false;
    
    const matchesSearch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filter) {
      case "completed":
        return matchesSearch && task.completed;
      case "pending":
        return matchesSearch && !task.completed;
      case "overdue":
        if (!task.deadline) return false;
        const deadline = new Date(task.deadline);
        return matchesSearch && !task.completed && deadline < new Date() && !isNaN(deadline.getTime());
      case "upcoming":
        if (!task.deadline) return false;
        const deadlineDate = new Date(task.deadline);
        if (isNaN(deadlineDate.getTime())) return false;
        const daysDiff = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
        return matchesSearch && !task.completed && daysDiff <= 3 && daysDiff >= 0;
      default:
        return matchesSearch;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nhiệm vụ của tôi</h1>
        <p className="text-gray-600">Quản lý và theo dõi các nhiệm vụ được giao</p>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhiệm vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
            <option value="overdue">Quá hạn</option>
            <option value="upcoming">Sắp đến hạn</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có nhiệm vụ nào</h3>
          <p className="text-gray-600">
            {searchTerm ? "Không tìm thấy nhiệm vụ phù hợp với từ khóa tìm kiếm." : "Bạn chưa có nhiệm vụ nào được giao."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="p-6">
                {/* Task Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task)}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                        {task?.taskName || "Tên nhiệm vụ không xác định"}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task)}`}>
                        {getStatusText(task)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task Info */}
                <div className="space-y-3 mb-4">
                  {task?.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CalendarDaysIcon className="h-4 w-4" />
                    <span>Hạn: {task?.deadline ? formatDate(task.deadline) : "Chưa có deadline"}</span>
                  </div>
                  
                  {task?.subject?.name && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DocumentTextIcon className="h-4 w-4" />
                      <span>Môn: {task.subject.name}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewDetail(task)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Chi tiết
                  </button>
                  
                  <button
                    onClick={() => handleViewSubmissions(task)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                  >
                    <DocumentArrowUpIcon className="h-4 w-4" />
                    Nộp bài
                  </button>
                  
                  {!task.completed && (
                    <button
                      onClick={() => handleMarkCompleted(task.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Hoàn thành
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Submission Panel */}
      {showSubmissionPanel && (
        <TaskSubmissionPanel
          assignment={selectedTask}
          onClose={() => setShowSubmissionPanel(false)}
        />
      )}

      {/* Task Detail Modal */}
      {showDetailModal && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default MyTasksPage;
