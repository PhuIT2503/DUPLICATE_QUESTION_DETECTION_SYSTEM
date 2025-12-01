import React from "react";
import { FileText, Calendar, Users } from "lucide-react";
import api from "../../api/axiosapi";
import { jwtDecode } from "jwt-decode";

const StatCard = ({ title, value, icon: Icon, iconColor, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <p className={`text-2xl font-bold ${iconColor}`}>{value}</p>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const DashboardHome = ({ user }) => {
  if (!user) {
    return (
      <div className="text-center text-gray-600 py-10">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-md">
        <h2 className="text-2xl font-bold mb-2">Chào mừng, {user.fullName}!</h2>
        <p className="opacity-90">Vai trò: {user.getRoleName()}</p>
        <p className="text-sm mt-2 opacity-80">
          Đại học Giao thông Vận tải TP.HCM - Hệ thống QBCA
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Thống kê hệ thống"
          value="1,234"
          icon={FileText}
          iconColor="text-teal-500"
          description="Câu hỏi trong ngân hàng"
        />
        <StatCard
          title="Nhiệm vụ"
          value="8"
          icon={Calendar}
          iconColor="text-orange-500"
          description="Nhiệm vụ đang chờ"
        />
        <StatCard
          title="Người dùng"
          value="45"
          icon={Users}
          iconColor="text-blue-500"
          description="Người dùng hoạt động"
        />
      </div>
    </div>
  );
};

export default DashboardHome;
