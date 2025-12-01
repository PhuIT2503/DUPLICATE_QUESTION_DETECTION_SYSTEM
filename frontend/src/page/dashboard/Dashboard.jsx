import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import RouteConfig from "../../models/RouteConfig";
import DashboardHeader from "../../components/layout/DashboardHeader";
import Sidebar from "../../components/layout/Sidebar";
import DashboardHome from "./DashboardHome";
import SubjectsPage from "./SubjectsPage";
import QuestionsPage from "./QuestionsPage";
import AssignmentsPage from "./AssignmentsPage";
import UsersPage from "./UsersPage";
import api from "../../api/axiosapi";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState("/questions");
  const routeConfig = new RouteConfig();
  const userRoutes = routeConfig.getRoutesForUser(user);

  // 🪵 Thêm log để debug
  console.log("User role:", user.role);
  console.log(
    "User routes:",
    userRoutes.map((r) => r.path)
  );
  console.log("Current path:", currentPath);

  const renderPage = () => {
    switch (currentPath) {
      case "/questions":
        return <QuestionsPage />; // <-- CHÍNH XÁC
      // các trang khác
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex">
      <Sidebar
        routes={userRoutes}
        currentPath={currentPath}
        onNavigate={setCurrentPath}
      />
      {/* ✅ RENDER Ở ĐÂY */}
      <main className="flex-1 p-6">{renderPage()}</main>
    </div>
  );
};

export default Dashboard;
