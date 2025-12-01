import React, { useState, useEffect } from "react";
import api from "../../api/axiosapi";
import { PlusCircle, Trash2, Edit2, RefreshCcw } from "lucide-react";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [newUser, setNewUser] = useState({
    userCode: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "LECTURER",
  });

  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const allowedRoles = [
    "LECTURER",
    "SUBJECT_HEAD",
    "DEPARTMENT_HEAD",
    "EXAM_OFFICE_HEAD",
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    const requiredFields = [
      "userCode",
      "password",
      "email",
      "firstName",
      "lastName",
      "role",
    ];

    for (let field of requiredFields) {
      if (!newUser[field]) {
        alert(`Vui lòng nhập đầy đủ trường: ${field}`);
        return;
      }
    }

    try {
      const res = await api.post("/auth/register", newUser);
      alert("Tạo người dùng thành công!");
      setNewUser({
        userCode: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "LECTURER",
      });
      fetchUsers();
    } catch (err) {
      alert("Lỗi khi đăng ký người dùng.");
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert("Không thể xoá người dùng.");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({
      id: user.id,
      userCode: user.userCode,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || "",
      role: user.role,
    });
    setIsEditing(true);
  };

  const handleUpdateUser = async () => {
    const requiredFields = ["userCode", "email", "firstName", "lastName", "role"];

    for (let field of requiredFields) {
      if (!editingUser[field]) {
        alert(`Vui lòng nhập đầy đủ trường: ${field}`);
        return;
      }
    }

    try {
      const res = await api.put(`/users/${editingUser.id}`, editingUser);
      alert("Cập nhật người dùng thành công!");
      setEditingUser(null);
      setIsEditing(false);
      fetchUsers();
    } catch (err) {
      alert("Lỗi khi cập nhật người dùng.");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setIsEditing(false);
  };

  const filteredUsers = users
    .filter((u) => !["RD_STAFF", "ADMIN"].includes(u.role))
    .filter((u) => {
      const name = `${u.lastName || ""} ${u.firstName || ""}`;
      const role = u.role || "";
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        role.toLowerCase().includes(search.toLowerCase())
      );
    });


  return (
    <div className="bg-white rounded-xl shadow-sm border border-teal-100 p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-teal-800 mb-4">Quản lý người dùng</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          className="w-full border p-2 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={fetchUsers}
          className="bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
        {isEditing ? (
          // Form sửa người dùng
          <>
            <input
              type="text"
              placeholder="Mã người dùng"
              className="border p-2 rounded-md"
              value={editingUser.userCode}
              onChange={(e) => setEditingUser({ ...editingUser, userCode: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded-md"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Tên"
              className="border p-2 rounded-md"
              value={editingUser.firstName}
              onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Họ"
              className="border p-2 rounded-md"
              value={editingUser.lastName}
              onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Số điện thoại (tuỳ chọn)"
              className="border p-2 rounded-md"
              value={editingUser.phoneNumber}
              onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
            />
            <select
              className="border p-2 rounded-md"
              value={editingUser.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            >
              {allowedRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <button
              onClick={handleUpdateUser}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" /> Cập nhật
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Hủy
            </button>
          </>
        ) : (
          // Form thêm người dùng mới
          <>
            <input
              type="text"
              placeholder="Mã người dùng"
              className="border p-2 rounded-md"
              value={newUser.userCode}
              onChange={(e) => setNewUser({ ...newUser, userCode: e.target.value })}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="border p-2 rounded-md"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded-md"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Tên"
              className="border p-2 rounded-md"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Họ"
              className="border p-2 rounded-md"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Số điện thoại (tuỳ chọn)"
              className="border p-2 rounded-md"
              value={newUser.phoneNumber}
              onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
            />
            <select
              className="border p-2 rounded-md"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              {allowedRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddUser}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center gap-1 col-span-2 md:col-span-1"
            >
              <PlusCircle className="w-4 h-4" /> Thêm
            </button>
          </>
        )}
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="text-teal-600">Đang tải danh sách người dùng...</div>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Họ và Tên</th>
              <th className="p-2">Email</th>
              <th className="p-2">Vai trò</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{`${user.lastName} ${user.firstName}`}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2 space-x-2">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:underline"
                    >
                      <Edit2 className="inline w-4 h-4" /> Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:underline"
                    >
                      <Trash2 className="inline w-4 h-4" /> Xoá
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersPage;
