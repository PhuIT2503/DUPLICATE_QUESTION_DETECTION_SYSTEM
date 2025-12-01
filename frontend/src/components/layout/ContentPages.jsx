import React from "react";
import { ROLE_NAMES } from "../../constants/roles";
import { useAuth } from "../../contexts/AuthContext";

// Component pages
const SubjectPage = require("../../page/dashboard/SubjectsPage").default;
const AssignmentsPage = require("../../page/dashboard/AssignmentsPage").default;
const MyTasksPage = require("../../page/dashboard/MyTasksPage").default;
const UserPage = require("../../page/dashboard/UsersPage").default;
const QuestionsPage = require("../../page/dashboard/QuestionsPage").default;
const ExamsPage = require("../../page/dashboard/ExamsPage").default;

const ContentPages = ({ currentPath }) => {
  const { user } = useAuth();
  
  if (currentPath === "/subjects") return <SubjectPage user={user} />;
  if (currentPath === "/assignments") return <AssignmentsPage user={user} />;
  if (currentPath === "/my-tasks") return <MyTasksPage />;
  if (currentPath === "/users") return <UserPage user={user} />;
  if (currentPath === "/questions") return <QuestionsPage user={user} />;
  if (currentPath === "/exams") return <ExamsPage user={user} />;
  if (currentPath === "/dashboard")
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Chào mừng, {user.fullName}!
          </h2>
          <p className="opacity-90">
            Vai trò: {ROLE_NAMES[user.role] || "Vai trò không xác định"}
          </p>
          <p className="text-sm mt-2 opacity-80">
            Đại học Giao thông Vận tải TP.HCM - Hệ thống QBCA
          </p>
        </div>
      </div>
    );
  return (
    <div className="bg-white rounded-xl shadow-sm border border-teal-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Trang không tồn tại
      </h2>
      <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
    </div>
  );
};

export default ContentPages;
