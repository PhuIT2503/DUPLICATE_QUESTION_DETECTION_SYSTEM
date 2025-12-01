import React, { useState } from "react";
import { Shield, Menu, X } from "lucide-react";

const Sidebar = ({ routes, currentPath, onNavigate, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Lọc routes dựa trên quyền của user
  const filteredRoutes = routes.filter((route) => {
    // Nếu route không có yêu cầu quyền, hiển thị cho tất cả
    if (!route.allowedRoles || route.allowedRoles.length === 0) {
      return true;
    }
    
    // Kiểm tra user có role được phép không
    if (user?.role && route.allowedRoles.includes(user.role)) {
      return true;
    }
    
    return false;
  });

  return (
    <>
      {/* Nút hamburger chỉ hiện trên mobile */}
      <div className="md:hidden p-4 flex items-center justify-between bg-teal-800 text-white">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-teal-300" />
          <span className="font-bold text-lg">UTH QBCA</span>
        </div>
        <button onClick={toggleSidebar}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (ẩn hiện tùy trạng thái) */}
      <aside
        className={`bg-teal-800 text-white w-64 min-h-screen fixed z-30 top-0 left-0 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="w-8 h-8 text-teal-300" />
            <div>
              <span className="text-xl font-bold block">UTH QBCA</span>
              <span className="text-xs text-teal-300">
                Trường đại học Giao thông vận tải TP.HCM
              </span>
            </div>
          </div>
          
          <nav className="space-y-2">
            {filteredRoutes.map((route) => {
              const Icon = route.icon;
              const isActive = currentPath === route.path;
              return (
                <button
                  key={route.path}
                  onClick={() => {
                    onNavigate(route.path);
                    setIsOpen(false); // đóng menu sau khi nhấn
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-teal-600 text-white shadow-lg"
                      : "text-teal-100 hover:bg-teal-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{route.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay để đóng khi click ngoài (mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
