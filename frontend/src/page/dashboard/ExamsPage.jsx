import React, { useState, useEffect } from "react";
import api from "../../api/axiosapi";
import { Card, CardContent } from "../../components/ui/card";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ExamsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [level, setLevel] = useState("Dễ");
  const [numQuestions, setNumQuestions] = useState(5);
  const [exam, setExam] = useState(null);
  const [examHistory, setExamHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects");
        setSubjects(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách môn học:", err);
      }
    };
    fetchSubjects();

    const fetchExams = async () => {
      try {
        const res = await api.get("/exams");
        setExamHistory(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách đề thi:", err);
      }
    };
    fetchExams();
  }, []);

  const handleGenerateExam = async () => {
    if (!subjectId || !numQuestions || numQuestions <= 0) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await api.post("/exams/generate", {
        subjectId,
        level,
        numQuestions,
      });
      setExam(response.data);
      setExamHistory((prev) => [response.data, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi tạo đề thi");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!exam) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Đề thi", 14, 20);

    const rows = exam.questions.map((q, index) => [
      `Câu ${index + 1}`,
      q.content,
      q.level,
    ]);

    doc.autoTable({
      head: [["STT", "Nội dung", "Mức độ"]],
      body: rows,
      startY: 30,
    });

    doc.save("de-thi.pdf");
  };

  const handleEditExam = async (examId) => {
    try {
      const res = await api.get(`/exams/${examId}`);
      setExam(res.data);
    } catch (err) {
      console.error("Không thể tải đề để sửa:", err);
    }
  };

  const handleQuestionChange = (index, content) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[index].content = content;
    setExam({ ...exam, questions: updatedQuestions });
  };

  const handleSaveExam = async () => {
    try {
      setSaving(true);
      await api.put(`/exams/${exam.id}`, {
        ...exam,
        questions: exam.questions,
      });
      setSuccessMsg("Đã lưu thay đổi đề thi");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Lỗi khi lưu đề thi:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tạo đề thi</h2>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Môn học
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">-- Chọn môn học --</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chọn mức độ</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="Dễ">Dễ</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Khó">Khó</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng câu hỏi</label>
          <input
            type="number"
            min="1"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleGenerateExam}
          disabled={loading}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          {loading ? "Đang tạo..." : "Tạo bài kiểm tra"}
        </button>
      </div>

      {exam && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-teal-700">Đề thi mới tạo</h3>
            <div className="space-x-2">
              <button
                onClick={handleSaveExam}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                {saving ? "Đang lưu..." : "Lưu đề thi"}
              </button>
              <button
                onClick={handleExportPDF}
                className="text-sm bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200"
              >
                Xuất PDF
              </button>
            </div>
          </div>
          {successMsg && <p className="text-green-600 text-sm mb-2">{successMsg}</p>}
          <div className="grid gap-4">
            {exam.questions?.map((q, index) => (
              <Card key={q.id}>
                <CardContent className="p-4 space-y-2">
                  <p className="font-medium text-gray-800">Câu {index + 1}:</p>
                  <textarea
                    value={q.content}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                  <p className="text-sm text-gray-500">Mức độ: {q.level}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {examHistory.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2 text-teal-800">Lịch sử đề thi</h3>
          <ul className="space-y-2">
            {examHistory.map((e) => (
              <li
                key={e.id}
                className="p-3 border rounded hover:bg-gray-50 transition text-sm cursor-pointer"
                onClick={() => handleEditExam(e.id)}
              >
                Đề ID: {e.id} | Môn: {e.subjectName || "?"} | {e.questions.length} câu | Ngày: {new Date(e.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExamsPage;
