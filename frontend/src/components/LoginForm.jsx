import React, { useState } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!username || !password) return;

    setLoading(true);
    setError("");

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Đại học Giao thông Vận tải TP.HCM - Hệ thống QBCA</h1>
          <p className="text-gray-600 mt-2">
            Hệ thống kiểm tra ngân hàng câu hỏi QBCA
          </p>
          <p className="text-teal-600 font-medium text-sm">
            Đại học Giao thông Vận tải TP.HCM
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 pr-12"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </div>

        <div className="mt-6 p-4 bg-teal-50 rounded-lg">
          <p className="text-sm text-teal-800 font-medium mb-2">
            Tài khoản demo:
          </p>
          <div className="text-xs text-teal-600 space-y-1">
            <div>• rd_staff / 123456 (Nhân viên R&D)</div>
            <div>• dept_head / 123456 (Trưởng khoa)</div>
            <div>• subject_head / 123456 (Trưởng bộ môn)</div>
            <div>• lecturer / 123456 (Giảng viên)</div>
            <div>• exam_office / 123456 (Trưởng phòng KT)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
