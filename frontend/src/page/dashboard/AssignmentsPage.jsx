import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, CheckIcon, ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import api from "../../api/axiosapi";
import TaskSubmissionManager from "../../components/TaskSubmissionManager";
import { useAuth } from "../../contexts/AuthContext";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSubmissionManager, setShowSubmissionManager] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const { user } = useAuth();

  // Kiểm tra quyền truy cập
  const canViewAssignments = user && ['RD_STAFF', 'RD_ADMIN', 'DEPARTMENT_HEAD', 'SUBJECT_HEAD'].includes(user.role);
  const canCreateAssignments = user && ['RD_STAFF', 'RD_ADMIN', 'DEPARTMENT_HEAD', 'SUBJECT_HEAD'].includes(user.role);
  const canApproveAssignments = user && ['RD_STAFF', 'RD_ADMIN', 'DEPARTMENT_HEAD'].includes(user.role);

  const [newAssignment, setNewAssignment] = useState({
    userId: "",
    subjectId: "",
    taskName: "",
    description: "",
    startDate: "",
    deadline: "",
  });

  useEffect(() => {
    fetchAssignments();
    fetchUsers();
    fetchSubjects();
  }, []);

  const fetchAssignments = async () => {
    try {
      console.log("Đang tải danh sách assignments...");
      console.log("User role:", user?.role);
      console.log("Token:", localStorage.getItem('token') ? 'Có token' : 'Không có token');
      
      const res = await api.get("/assignments");
      console.log("Assignments response:", res.data);
      
      // Đảm bảo luôn là array
      setAssignments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Không thể tải danh sách phân công:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      // Nếu API chưa có hoặc lỗi, giữ assignments rỗng
      setAssignments([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      const filtered = res.data.filter(
        (u) => !["ADMIN", "RD_STAFF"].includes(u.role)
      );
      setUsers(filtered);
    } catch (err) {
      console.error("Không thể tải danh sách người dùng:", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error("Không thể tải danh sách môn học:", err);
    }
  };

  const handleAddAssignment = async () => {
    if (
      !newAssignment.userId ||
      !newAssignment.subjectId ||
      !newAssignment.taskName ||
      !newAssignment.deadline ||
      !newAssignment.startDate
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      // Debug: In thông tin trước khi gửi
      console.log("=== ASSIGNMENT DEBUG ===");
      console.log("New Assignment Data:", newAssignment);
      console.log("Selected User:", users.find(u => u.id == newAssignment.userId));
      console.log("Selected Subject:", subjects.find(s => s.id == newAssignment.subjectId));
      
      // Tạo dữ liệu phù hợp với backend model
      const assignmentData = {
        taskName: newAssignment.taskName,
        description: newAssignment.description || `Giao cho ${getUserDisplayName(newAssignment.userId)} từ ${newAssignment.startDate} đến ${newAssignment.deadline}`,
        userId: parseInt(newAssignment.userId),
        startDate: newAssignment.startDate,
        deadline: newAssignment.deadline,
        completed: false,
        subject: {
          id: parseInt(newAssignment.subjectId)
        }
      };

      console.log("Assignment Data to send:", assignmentData);
      console.log("UserId as number:", assignmentData.userId);
      console.log("========================");

      const res = await api.post("/assignments", assignmentData);
      console.log("Response from backend:", res.data);
      
      // Đảm bảo assignments luôn là array trước khi thêm
      const currentAssignments = Array.isArray(assignments) ? assignments : [];
      setAssignments([...currentAssignments, res.data]);
      setNewAssignment({ 
        userId: "", 
        subjectId: "", 
        taskName: "", 
        description: "", 
        startDate: "", 
        deadline: "" 
      });
      alert("Giao nhiệm vụ thành công!");
    } catch (err) {
      console.error("Lỗi khi giao nhiệm vụ:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error headers:", err.response?.headers);
      
      let errorMessage = "Lỗi khi giao nhiệm vụ: ";
      if (err.response?.status === 403) {
        errorMessage += "Không có quyền thực hiện. Vui lòng kiểm tra role của bạn.";
      } else if (err.response?.status === 400) {
        errorMessage += "Dữ liệu không hợp lệ. " + (err.response?.data?.message || "");
      } else if (err.response?.status === 500) {
        errorMessage += "Lỗi server. Kiểm tra backend logs.";
      } else {
        errorMessage += err.message;
      }
      
      alert(errorMessage);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      // Đảm bảo assignments là array trước khi tìm
      const currentAssignments = Array.isArray(assignments) ? assignments : [];
      const assignment = currentAssignments.find(a => a.id === id);
      
      if (!assignment) {
        alert("Không tìm thấy nhiệm vụ!");
        return;
      }
      
      const updatedAssignment = { ...assignment, completed: !assignment.completed };
      
      await api.put(`/assignments/${id}`, updatedAssignment);
      
      // Đảm bảo assignments là array trước khi map
      const updatedAssignments = Array.isArray(assignments) ? assignments : [];
      setAssignments(
        updatedAssignments.map((a) =>
          a.id === id ? { ...a, completed: !a.completed } : a
        )
      );
      alert("Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      alert("Lỗi khi cập nhật trạng thái!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhiệm vụ này?")) return;
    
    try {
      await api.delete(`/assignments/${id}`);
      // Đảm bảo assignments là array trước khi filter
      const deleteAssignments = Array.isArray(assignments) ? assignments : [];
      setAssignments(deleteAssignments.filter((a) => a.id !== id));
      alert("Xóa nhiệm vụ thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa nhiệm vụ:", err);
      alert("Lỗi khi xóa nhiệm vụ!");
    }
  };

  const handleApproveAssignment = async (id) => {
    try {
      await api.post(`/assignments/${id}/approve`);
      alert("Đã duyệt nhiệm vụ thành công!");
    } catch (err) {
      console.error("Lỗi khi duyệt nhiệm vụ:", err);
      alert("Lỗi khi duyệt nhiệm vụ!");
    }
  };

  const handleRejectAssignment = async (id) => {
    const reason = prompt("Nhập lý do từ chối (tùy chọn):");
    try {
      const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
      await api.post(`/assignments/${id}/reject${params}`);
      alert("Đã từ chối nhiệm vụ!");
    } catch (err) {
      console.error("Lỗi khi từ chối nhiệm vụ:", err);
      alert("Lỗi khi từ chối nhiệm vụ!");
    }
  };

  const handleCheckUpcomingTasks = async () => {
    try {
      await api.post('/assignments/check-upcoming');
      alert("Đã kiểm tra và gửi thông báo cho nhiệm vụ sắp đến hạn!");
    } catch (err) {
      console.error("Lỗi khi kiểm tra nhiệm vụ sắp đến hạn:", err);
      alert("Lỗi khi kiểm tra nhiệm vụ sắp đến hạn!");
    }
  };

  const handleCheckOverdueTasks = async () => {
    try {
      await api.post('/assignments/check-overdue');
      alert("Đã kiểm tra và gửi thông báo cho nhiệm vụ quá hạn!");
    } catch (err) {
      console.error("Lỗi khi kiểm tra nhiệm vụ quá hạn:", err);
      alert("Lỗi khi kiểm tra nhiệm vụ quá hạn!");
    }
  };

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionManager(true);
  };

  // Hàm helper để lấy tên hiển thị
  const getUserDisplayName = (userId) => {
    const u = users.find((u) => u.id == userId); // Sử dụng == để so sánh cả string và number
    return u ? `${u.lastName} ${u.firstName} (${u.userCode})` : "Không rõ";
  };

  const getSubjectName = (subjectId) => {
    const s = subjects.find((s) => s.id == subjectId); // Sử dụng == để so sánh cả string và number
    return s ? s.name : "Không rõ";
  };

  // Hàm lọc danh sách nhiệm vụ dựa trên filter và search
  const filtered = Array.isArray(assignments) ? 
    assignments.filter((a) => {
      // Lọc theo trạng thái
      let statusMatch = true;
      if (filter === "completed") statusMatch = a.completed;
      else if (filter === "incomplete") statusMatch = !a.completed;
      
      // Lọc theo từ khóa tìm kiếm
      let searchMatch = true;
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase();
        searchMatch = 
          (a.taskName && a.taskName.toLowerCase().includes(search)) ||
          (a.description && a.description.toLowerCase().includes(search)) ||
          getUserDisplayName(a.userId).toLowerCase().includes(search) ||
          getSubjectName(a.subjectId || a.subject?.id).toLowerCase().includes(search);
      }
      
      return statusMatch && searchMatch;
    }) : [];

  // Nếu không có quyền xem, hiển thị thông báo
  if (!canViewAssignments) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 max-w-5xl mx-auto">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h2>
          <p className="text-gray-600 mb-4">
            Bạn không có quyền truy cập vào trang này.
          </p>
          <p className="text-sm text-gray-500">
            Quyền hiện tại: <span className="font-medium">{user?.role || 'Chưa xác định'}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-teal-100 p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-teal-800">Giao nhiệm vụ</h2>
        <button
          onClick={fetchAssignments}
          className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md flex items-center gap-1"
          title="Làm mới danh sách"
        >
          <ArrowPathIcon className="w-4 h-4" /> Làm mới
        </button>
      </div>

      {/* Form tạo nhiệm vụ - chỉ hiển thị cho người có quyền tạo */}
      {canCreateAssignments && (
        <>
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-teal-700 mb-3">Thông tin phân công nhiệm vụ</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Người được giao <span className="text-red-500">*</span>
            </label>
            <select
              value={newAssignment.userId}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, userId: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="">-- Chọn người dùng --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.lastName} {u.firstName} ({u.userCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Môn học <span className="text-red-500">*</span>
            </label>
            <select
              value={newAssignment.subjectId}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, subjectId: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="">-- Chọn môn học --</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên công việc <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={newAssignment.taskName}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, taskName: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            placeholder="Nhập tên công việc cần thực hiện"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả chi tiết
          </label>
          <textarea
            value={newAssignment.description}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, description: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            placeholder="Mô tả chi tiết về nhiệm vụ, yêu cầu, ghi chú..."
            rows="3"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={newAssignment.startDate}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, startDate: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
            <p className="text-xs text-gray-500 mt-1">Ngày bắt đầu thực hiện nhiệm vụ</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hạn hoàn thành <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={newAssignment.deadline}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, deadline: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
            <p className="text-xs text-gray-500 mt-1">Ngày phải hoàn thành nhiệm vụ</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleAddAssignment}
        className="bg-teal-600 text-white px-4 py-2 rounded-md mb-6 flex items-center gap-1"
      >
        <PlusIcon className="w-4 h-4" /> Giao nhiệm vụ
      </button>

      {/* Nút test thông báo */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleCheckUpcomingTasks}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Kiểm tra nhiệm vụ sắp đến hạn
        </button>
        <button
          onClick={handleCheckOverdueTasks}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Kiểm tra nhiệm vụ quá hạn
        </button>
      </div>
        </>
      )}

      {/* Thanh tìm kiếm và lọc */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        {/* Ô tìm kiếm */}
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên nhiệm vụ, mô tả, người dùng hoặc môn học..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Dropdown lọc trạng thái */}
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-md focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">Tất cả</option>
            <option value="incomplete">Đang chờ</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>

        {/* Hiển thị số kết quả */}
        <div className="text-sm text-gray-600">
          Hiển thị {filtered.length} / {assignments.length} nhiệm vụ
        </div>
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Người dùng</th>
            <th className="p-2 text-left">Công việc</th>
            <th className="p-2 text-left">Môn học</th>
            <th className="p-2 text-left">Ngày bắt đầu</th>
            <th className="p-2 text-left">Hạn chót</th>
            <th className="p-2 text-left">Trạng thái</th>
            <th className="p-2 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => (
            <tr key={a.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{getUserDisplayName(a.userId)}</td>
              <td className="p-2">
                <div className="font-medium text-gray-900">{a.taskName || "Không có tên"}</div>
                {a.description && (
                  <div className="text-gray-600 text-xs mt-1 line-clamp-2">{a.description}</div>
                )}
              </td>
              <td className="p-2">
                <div className="font-medium">{getSubjectName(a.subjectId || a.subject?.id)}</div>
              </td>
              <td className="p-2">{a.startDate}</td>
              <td className="p-2">{a.deadline}</td>
              <td className="p-2">
                <span className={a.completed ? "text-green-600" : "text-orange-500"}>
                  {a.completed ? "Hoàn thành" : "Đang chờ"}
                </span>
              </td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => handleToggleComplete(a.id)}
                  className="text-green-600 hover:underline"
                >
                  <CheckIcon className="w-4 h-4 inline" /> 
                  {a.completed ? "Bỏ đánh dấu" : "Đánh dấu"}
                </button>
                
                {/* Nút phê duyệt/từ chối - chỉ hiển thị cho những người có quyền */}
                {canApproveAssignments && (
                  <>
                    <button
                      onClick={() => handleApproveAssignment(a.id)}
                      className="text-blue-600 hover:underline"
                      title="Duyệt nhiệm vụ"
                    >
                      ✓ Duyệt
                    </button>
                    <button
                      onClick={() => handleRejectAssignment(a.id)}
                      className="text-orange-600 hover:underline"
                      title="Từ chối nhiệm vụ"
                    >
                      ✗ Từ chối
                    </button>
                  </>
                )}
                
                {/* Nút xóa - chỉ hiển thị cho những người có quyền tạo */}
                {canCreateAssignments && (
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-red-600 hover:underline"
                  >
                    <TrashIcon className="w-4 h-4 inline" /> Xoá
                  </button>
                )}
                
                <button
                  onClick={() => handleViewSubmissions(a)}
                  className="text-indigo-600 hover:underline"
                  title="Xem bài nộp"
                >
                  📂 Xem bài nộp
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="7" className="p-4 text-center text-gray-500">
                {searchTerm ? "Không tìm thấy nhiệm vụ nào phù hợp." : "Không có nhiệm vụ nào."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Quản lý bài nộp */}
      {showSubmissionManager && (
        <TaskSubmissionManager
          assignment={selectedAssignment}
          onClose={() => setShowSubmissionManager(false)}
        />
      )}
    </div>
  );
};

export default AssignmentsPage;
