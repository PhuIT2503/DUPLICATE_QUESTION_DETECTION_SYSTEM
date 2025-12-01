import React, { useState, useEffect } from "react";
import { 
  DocumentArrowDownIcon, 
  DocumentArrowUpIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarDaysIcon,
  UserIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import api from "../api/axiosapi";
import { useAuth } from "../contexts/AuthContext";

const TaskSubmissionManager = ({ assignment, onClose }) => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [actionType, setActionType] = useState(""); // approve, reject, revision

  useEffect(() => {
    fetchSubmissions();
  }, [assignment.id]);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get(`/task-submissions/assignment/${assignment.id}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Không thể tải danh sách nộp bài:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (submissionId, fileName) => {
    try {
      const res = await api.get(`/task-submissions/download/${submissionId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Không thể tải file:", err);
      alert("Không thể tải file. Vui lòng thử lại.");
    }
  };

  const handleActionSubmission = async () => {
    if (!selectedSubmission || !user?.id) return;
    
    try {
      let endpoint = "";
      let data = { 
        feedback,
        reviewerId: user.id // Lấy reviewer ID từ auth context
      };
      
      switch (actionType) {
        case "approve":
          endpoint = `/task-submissions/${selectedSubmission.id}/approve`;
          break;
        case "reject":
          endpoint = `/task-submissions/${selectedSubmission.id}/reject`;
          break;
        case "revision":
          endpoint = `/task-submissions/${selectedSubmission.id}/revision`;
          break;
        default:
          return;
      }
      
      await api.post(endpoint, data);
      
      // Refresh submissions
      fetchSubmissions();
      
      // Reset form
      setSelectedSubmission(null);
      setFeedback("");
      setShowFeedbackModal(false);
      setActionType("");
      
      alert("Xử lý thành công!");
    } catch (err) {
      console.error("Không thể xử lý:", err);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa file này?")) return;
    
    try {
      await api.delete(`/task-submissions/${submissionId}`);
      fetchSubmissions();
      alert("Xóa thành công!");
    } catch (err) {
      console.error("Không thể xóa:", err);
      alert("Không thể xóa file. Vui lòng thử lại.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "REVISION":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Từ chối";
      case "REVISION":
        return "Yêu cầu chỉnh sửa";
      default:
        return status;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Quản lý nộp bài</h2>
              <p className="text-blue-100 mt-1">Nhiệm vụ: {assignment.taskName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có file nào được nộp</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <DocumentArrowUpIcon className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">{submission.fileName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {getStatusText(submission.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <CalendarDaysIcon className="h-4 w-4" />
                          <span>Nộp lúc: {formatDate(submission.submittedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DocumentTextIcon className="h-4 w-4" />
                          <span>Kích thước: {formatFileSize(submission.fileSize)}</span>
                        </div>
                        {submission.reviewedAt && (
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4" />
                            <span>Đánh giá lúc: {formatDate(submission.reviewedAt)}</span>
                          </div>
                        )}
                      </div>

                      {submission.feedback && (
                        <div className="bg-gray-50 p-3 rounded-md mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Phản hồi:</p>
                          <p className="text-sm text-gray-600">{submission.feedback}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleDownload(submission.id, submission.fileName)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="Tải xuống"
                      >
                        <DocumentArrowDownIcon className="h-5 w-5" />
                      </button>
                      
                      {submission.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setActionType("approve");
                              setShowFeedbackModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                            title="Duyệt"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setActionType("reject");
                              setShowFeedbackModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            title="Từ chối"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setActionType("revision");
                              setShowFeedbackModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                            title="Yêu cầu chỉnh sửa"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDeleteSubmission(submission.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        title="Xóa"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {actionType === "approve" && "Duyệt file"}
                {actionType === "reject" && "Từ chối file"}
                {actionType === "revision" && "Yêu cầu chỉnh sửa"}
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">File: {selectedSubmission?.fileName}</p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phản hồi:
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Nhập phản hồi..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setSelectedSubmission(null);
                    setFeedback("");
                    setActionType("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  onClick={handleActionSubmission}
                  className={`px-4 py-2 rounded-md text-white ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : actionType === "reject"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSubmissionManager;
