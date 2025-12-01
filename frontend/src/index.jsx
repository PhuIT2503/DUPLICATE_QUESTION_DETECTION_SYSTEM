import React, { useState, useEffect } from "react";
import api from "./api/axiosapi";
import LoginForm from "./page/dashboard/LoginForm";
import {
  Home, FileText, Users, BookOpen, Calendar, User, LogOut, FileCheck, Shield
} from "lucide-react";
import "./index.css";
import NotificationBell from "./components/common/NotificationBell";
import { NotificationProvider } from "./contexts/NotificationContext";
import AuthProvider from "./contexts/AuthProvider";
import { useAuth } from "./contexts/AuthContext";

// Component pages
const SubjectPage = require("./page/dashboard/SubjectsPage").default;
const AssignmentsPage = require("./page/dashboard/AssignmentsPage").default;
const MyTasksPage = require("./page/dashboard/MyTasksPage").default;
const UserPage = require("./page/dashboard/UsersPage").default;
const QuestionsPage = require("./page/dashboard/QuestionsPage").default;
const ExamsPage = require("./page/dashboard/ExamsPage").default;
const ContentPages = require("./components/layout/ContentPages").default;
const Sidebar = require("./components/layout/Sidebar").default;

const USER_ROLES = {
  RD_STAFF: "RD_STAFF",
  DEPARTMENT_HEAD: "DEPARTMENT_HEAD",
  SUBJECT_HEAD: "SUBJECT_HEAD",
  LECTURER: "LECTURER",
  EXAM_OFFICE_HEAD: "EXAM_OFFICE_HEAD",
};

const ROLE_NAMES = {
  [USER_ROLES.RD_STAFF]: "Nhân viên R&D",
  [USER_ROLES.DEPARTMENT_HEAD]: "Trưởng khoa",
  [USER_ROLES.SUBJECT_HEAD]: "Trưởng bộ môn",
  [USER_ROLES.LECTURER]: "Giảng viên",
  [USER_ROLES.EXAM_OFFICE_HEAD]: "Trưởng phòng Khảo thí",
};

const allRoutes = [
  { path: "/dashboard", name: "Trang chủ", icon: Home, allowedRoles: Object.values(USER_ROLES) },
  { path: "/subjects", name: "Quản lý môn học", icon: BookOpen, allowedRoles: [USER_ROLES.RD_STAFF] },
  { path: "/questions", name: "Ngân hàng câu hỏi", icon: FileText, allowedRoles: [USER_ROLES.RD_STAFF, USER_ROLES.LECTURER, USER_ROLES.SUBJECT_HEAD] },
  { path: "/assignments", name: "Phân công nhiệm vụ", icon: Calendar, allowedRoles: [USER_ROLES.DEPARTMENT_HEAD, USER_ROLES.SUBJECT_HEAD, USER_ROLES.EXAM_OFFICE_HEAD, USER_ROLES.RD_STAFF] },
  { path: "/my-tasks", name: "Nhiệm vụ của tôi", icon: Calendar, allowedRoles: [USER_ROLES.LECTURER] },
  { path: "/exams", name: "Quản lý đề thi", icon: FileCheck, allowedRoles: [USER_ROLES.EXAM_OFFICE_HEAD, USER_ROLES.RD_STAFF] },
  { path: "/users", name: "Quản lý người dùng", icon: Users, allowedRoles: [USER_ROLES.RD_STAFF] },
];

const UTHQBCADemo = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

const App = () => {
  const { user, login, logout, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState("/dashboard");

  const handleLogout = () => {
    logout();
    setCurrentPath("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      {user ? (
        <div className="flex min-h-screen">
          <Sidebar routes={allRoutes} currentPath={currentPath} onNavigate={setCurrentPath} user={user} />
          <div className="flex-1 flex flex-col">
            <DashboardHeader user={user} onLogout={handleLogout} />
            <main className="flex-1 p-6 bg-gray-50">
              <ContentPages currentPath={currentPath} />
            </main>
          </div>
        </div>
      ) : (
        <LoginForm
          onLogin={async (username, password) => {
            try {
              const userData = await login(username, password);
              setCurrentPath("/dashboard");
            } catch (error) {
              console.error("Login failed:", error);
            }
          }}
        />
      )}
    </NotificationProvider>
  );
};

const DashboardHeader = ({ user, onLogout }) => (
  <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">UTH QBCA Dashboard</h1>
        <p className="text-teal-600">Hệ thống kiểm tra ngân hàng câu hỏi - UTH</p>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationBell />
        <div className="text-right">
          <p className="font-medium text-gray-800">{user.fullName}</p>
          <p className="text-sm text-teal-600">{ROLE_NAMES[user.role] || "Vai trò không xác định"}</p>
        </div>
        <div className="bg-teal-100 w-10 h-10 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-teal-600" />
        </div>
        <button
          onClick={onLogout}
          className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
);

export default UTHQBCADemo;
