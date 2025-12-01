import React from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "../common/DashboardHeader";
import ContentPages from "./ContentPages";

const DashboardLayout = ({
  user,
  currentPath,
  routes,
  onNavigate,
  onLogout,
}) => (
  <div className="flex min-h-screen">
    <Sidebar
      routes={routes}
      currentPath={currentPath}
      onNavigate={onNavigate}
      user={user}
    />
    <div className="flex-1 flex flex-col">
      <DashboardHeader user={user} onLogout={onLogout} />
      <main className="flex-1 p-6 bg-gray-50">
        <ContentPages currentPath={currentPath} user={user} />
      </main>
    </div>
  </div>
);

export default DashboardLayout;
