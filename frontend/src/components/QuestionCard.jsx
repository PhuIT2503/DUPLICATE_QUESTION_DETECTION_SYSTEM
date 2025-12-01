import React from "react";
import { Edit, Trash2 } from "lucide-react";

const QuestionCard = ({ question, onEdit, onDelete, showActions = true }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 flex justify-between">
      <div className="w-full">
        {/* Nội dung câu hỏi */}
        <div className="font-semibold text-gray-900 mb-2">
          {question.content}
        </div>

        {/* Metadata */}
        <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
          <span>Loại: {question.questionType || "Không xác định"}</span>
          <span>Độ khó: {question.difficulty || "Không rõ"}</span>
          {question.correctAnswer && (
            <span className="text-green-600">
              Đáp án đúng: {question.correctAnswer}
            </span>
          )}
        </div>

        {/* Danh sách đáp án (nếu là trắc nghiệm) */}
        {question.options && Array.isArray(question.options) && (
          <ul className="list-disc list-inside text-sm mt-2 text-gray-700">
            {question.options.map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Hành động */}
      {showActions && (
        <div className="flex flex-col items-end space-y-2 ml-4">
          <button
            onClick={() => onEdit?.(question)}
            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
            title="Sửa câu hỏi"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete?.(question.id)}
            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
            title="Xóa câu hỏi"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
