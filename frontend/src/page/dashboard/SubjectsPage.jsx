import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import api from "../../api/axiosapi";
import { jwtDecode } from "jwt-decode";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [newSubject, setNewSubject] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load danh sách môn học
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Hàm lấy danh sách môn học
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
      setError("");
    } catch (err) {
      console.error("Lỗi khi tải danh sách môn học", err);
      setError("Không thể tải danh sách môn học");
    } finally {
      setLoading(false);
    }
  };

  // Thêm môn học mới
  const handleAddSubject = async () => {
    if (!newSubject.name) {
      alert("Vui lòng nhập tên môn học");
      return;
    }
    try {
      // Theo controller, gửi params qua query string (reqParam), nên dùng params object
      const res = await api.post(
        "/subjects",
        null, // vì data body không dùng, gửi null
        { params: { name: newSubject.name, description: newSubject.description } }
        
      );
      setSubjects((prev) => [...prev, res.data]);
      setNewSubject({ name: "", description: "" });
      setError("");
    } catch (err) {
      console.error("Lỗi khi thêm môn học", err);
      alert("Thêm môn học thất bại");
    }

  };

  // Xoá môn học (giả sử backend có API DELETE /subjects/{id})
  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá môn học này?")) return;

    try {
      await api.delete(`/subjects/${id}`);
      setSubjects(subjects.filter((s) => s.id !== id));
      setError("");
    } catch (err) {
      console.error("Lỗi khi xoá môn học", err);
      alert("Xoá môn học thất bại");
    }
  };

  // Lọc tìm kiếm trên client
  const filteredSubjects = subjects.filter((s) => {
    const name = s.name ?? ""; // nếu s.name là undefined/null thì dùng chuỗi rỗng
    const code = s.code ?? "";
    const searchLower = search.toLowerCase();

    return (
      name.toLowerCase().includes(searchLower) ||
      code.toLowerCase().includes(searchLower)
    );
  });


  return (
    <div className="bg-white rounded-xl shadow-sm border border-teal-100 p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-teal-800 mb-4">Quản lý môn học</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">{error}</div>
      )}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm môn học..."
          className="w-full border p-2 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Tên môn học"
          className="flex-1 border p-2 rounded-md"
          value={newSubject.name}
          onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Mô tả"
          className="w-60 border p-2 rounded-md"
          value={newSubject.description}
          onChange={(e) =>
            setNewSubject({ ...newSubject, description: e.target.value })
          }
        />
        <button
          onClick={handleAddSubject}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 rounded-md flex items-center gap-1"
        >
          <PlusIcon className="w-4 h-4" />
          Thêm
        </button>
      </div>

      {loading ? (
        <div className="text-teal-600">Đang tải môn học...</div>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Tên môn học</th>
              <th className="p-2">Mô tả</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => (
                <tr key={subject.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{subject.name}</td>
                  <td className="p-2">{subject.description}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="text-red-600 hover:underline"
                    >
                      <TrashIcon className="w-4 h-4 inline" /> Xoá
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  Không có môn học nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubjectsPage;
// Note: This code assumes that the backend API is set up to handle the requests as described.