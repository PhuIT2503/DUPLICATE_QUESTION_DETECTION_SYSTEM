import React, { useState, useEffect } from "react";
import { 
  DocumentArrowUpIcon, 
  DocumentArrowDownIcon, 
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import api from "../api/axiosapi";

const TaskSubmissionPanel = ({ assignment, onClose }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchMySubmissions();
  }, [assignment.id]);

  const fetchMySubmissions = async () => {
    try {
      const res = await api.get(`/task-submissions/assignment/${assignment.id}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Không thể tải danh sách nộp bài:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn file để upload!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await api.post(`/task-submissions/upload/${assignment.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";
      
      fetchMySubmissions();
      alert("Upload thành công!");
    } catch (err) {
      console.error("Không thể upload file:", err);
      alert("Không thể upload file. Vui lòng thử lại.");
    } finally {
      setUploading(false);
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

  const handleDeleteSubmission = async (submissionId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa file này?")) return;
    
    try {
      await api.delete(`/task-submissions/${submissionId}`);
      fetchMySubmissions();
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <InformationCircleIcon className="h-5 w-5 text-yellow-600" />;
      case "APPROVED":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case "REJECTED":
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case "REVISION":
        return <PencilIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-600" />;
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

  const canUpload = () => {
    // Có thể upload nếu chưa có file nào hoặc file cuối cùng bị từ chối/yêu cầu chỉnh sửa
    if (submissions.length === 0) return true;
    
    const lastSubmission = submissions[0]; // Submissions được sắp xếp theo thời gian desc
    return lastSubmission.status === "REJECTED" || lastSubmission.status === "REVISION";
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
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Nộp bài tập</h2>
              <p className="text-green-100 mt-1">Nhiệm vụ: {assignment.taskName}</p>
              <p className="text-green-100 text-sm mt-1">Hạn nộp: {new Date(assignment.deadline).toLocaleString('vi-VN')}</p>
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
          {/* Upload Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Nộp file mới</h3>
            
            {canUpload() ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  
                  <div className="mb-4">
                    <input
                      id="file-input"
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                    />
                    <label
                      htmlFor="file-input"
                      className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Chọn file
                    </label>
                  </div>
                  
                  {selectedFile && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-600">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    {uploading ? "Đang upload..." : "Upload file"}
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Chỉ chấp nhận file PDF, Word, TXT, ZIP, RAR (tối đa 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="text-center text-gray-600">
                  <InformationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p>Bạn đã nộp file và đang chờ duyệt. Không thể upload file mới.</p>
                </div>
              </div>
            )}
          </div>

          {/* Submissions List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh sách file đã nộp</h3>
            
            {submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p>Chưa có file nào được nộp</p>
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
                          {getStatusIcon(submission.status)}
                          <h4 className="font-semibold">{submission.fileName}</h4>
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
                        </div>

                        {submission.feedback && (
                          <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                            <p className="text-sm font-medium text-blue-800 mb-1">
                              Phản hồi từ giảng viên:
                            </p>
                            <p className="text-sm text-blue-700">{submission.feedback}</p>
                            {submission.reviewedAt && (
                              <p className="text-xs text-blue-600 mt-1">
                                Đánh giá lúc: {formatDate(submission.reviewedAt)}
                              </p>
                            )}
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
                          <button
                            onClick={() => handleDeleteSubmission(submission.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            title="Xóa"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskSubmissionPanel;
