import React, { useState, useEffect } from "react";
import api from "../api/axiosapi";

const ExamForm = ({ onExamCreated }) => {
  const [easyCount, setEasyCount] = useState(5);
  const [mediumCount, setMediumCount] = useState(5);
  const [hardCount, setHardCount] = useState(5);
  const [subjectId, setSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy danh sách môn học từ API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects/active");
        setSubjects(res.data);
        if (res.data.length > 0) {
          setSubjectId(res.data[0].id);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách môn học:", err);
      }
    };

    fetchSubjects();
  }, []);

  const handleGenerateExam = async () => {
    if (!subjectId) {
      setError("Vui lòng chọn môn học.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await api.post("/exams/generate", {
        subjectId,
        easyCount,
        mediumCount,
        hardCount,
      });
      onExamCreated(response.data); // Gửi dữ liệu đề thi về component cha
    } catch (error) {
      console.error("Lỗi tạo đề thi:", error);
      setError("Không thể tạo đề thi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-md">
      <h2 className="text-lg font-bold mb-4">Tạo đề thi</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <label className="block mb-2">Chọn môn học</label>
      <select
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      >
        <option value="">-- Chọn môn học --</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 gap-3">
        <input
          type="number"
          placeholder="Số câu DỄ"
          value={easyCount}
          onChange={(e) => setEasyCount(Number(e.target.value))}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Số câu TRUNG BÌNH"
          value={mediumCount}
          onChange={(e) => setMediumCount(Number(e.target.value))}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Số câu KHÓ"
          value={hardCount}
          onChange={(e) => setHardCount(Number(e.target.value))}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={handleGenerateExam}
        disabled={loading}
        className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 w-full"
      >
        {loading ? "Đang tạo..." : "Tạo đề thi"}
      </button>
    </div>
  );
};

export default ExamForm;
