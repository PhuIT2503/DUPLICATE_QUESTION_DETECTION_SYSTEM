import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import api from "../api/axiosapi"

const UploadQuestions = ({ onAnalyzeDuplicates }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [textPreview, setTextPreview] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== "text/plain") {
      setError("Chỉ chấp nhận tệp .txt");
      return;
    }

    setError("");
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      setTextPreview(content);

      if (content.trim()) {
        await handleCheckDuplicateFile(uploadedFile);
      } else {
        setError("Tệp không có nội dung.");
      }
    };

    reader.readAsText(uploadedFile);
  };

  const handleCheckDuplicateFile = async (uploadedFile) => {
    if (!onAnalyzeDuplicates) return;

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await api.post("/duplicate-detection/check-duplicates-from-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const json = response.data;

      if (json.results && Array.isArray(json.results)) {
        const formattedResults = json.results.map((item) => ({
          input: item.question || item.query,
          status: item.status || "unknown",
          duplicates: item.duplicates?.length
            ? item.duplicates.map((d) => ({
                text: d.matchedQuestion || d.text,
                similarity: d.similarity,
              }))
            : [],
        }));

        onAnalyzeDuplicates(formattedResults);
      } else {
        setError("Phản hồi từ API không hợp lệ: Không tìm thấy kết quả.");
      }
    } catch (err) {
      console.error("Lỗi kiểm tra trùng lặp:", err);
      setError(`Không thể kiểm tra trùng lặp từ tệp: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100 flex flex-col space-y-4">
      <h3 className="font-semibold text-gray-800 mb-2">Tải tệp câu hỏi (.txt)</h3>
      <p className="text-sm text-gray-600">Hệ thống chỉ hỗ trợ kiểm tra nội dung từ tệp .txt</p>

      <label className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center cursor-pointer hover:border-teal-500 transition">
        <input
          type="file"
          accept=".txt"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center">
          <UploadCloud className="w-8 h-8 text-teal-600 mb-2" />
          <span className="text-gray-700 font-medium">Chọn tệp .txt để kiểm tra</span>
          <span className="text-sm text-gray-500">Kích thước nhỏ hơn 1MB</span>
        </div>
      </label>

      {loading && <p className="text-teal-600 text-sm">Đang kiểm tra trùng lặp...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {textPreview && (
        <div className="bg-gray-100 text-sm p-3 rounded-md max-h-40 overflow-auto">
          <p className="text-gray-600 mb-2 font-semibold">Xem trước nội dung:</p>
          <pre className="whitespace-pre-wrap break-words">{textPreview}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadQuestions;
