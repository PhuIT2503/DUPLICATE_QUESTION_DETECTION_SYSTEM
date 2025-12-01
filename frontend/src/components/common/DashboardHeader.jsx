import React from "react";
import { User, LogOut } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { ROLE_NAMES } from "../../constants/roles";

const DashboardHeader = ({ user, onLogout }) => (
  <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">UTH QBCA Dashboard</h1>
        <p className="text-teal-600">
          Hệ thống kiểm tra ngân hàng câu hỏi - UTH
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationBell user={user} />
        <div className="text-right">
          <p className="font-medium text-gray-800">{user.fullName}</p>
          <p className="text-sm text-teal-600">
            {ROLE_NAMES[user.role] || "Vai trò không xác định"}
          </p>
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

export default DashboardHeader;
