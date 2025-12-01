// src/components/QuestionForm.jsx
import React, { useState, useEffect } from "react";
import {
  QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
  DIFFICULTY_LEVELS,
  DIFFICULTY_LABELS,
} from "../constants/questionConstants";

const QuestionForm = ({ question, onClose, onSubmit }) => {
  const [content, setContent] = useState("");
  const [type, setType] = useState(QUESTION_TYPES.MULTIPLE_CHOICE);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.EASY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (question) {
      setContent(question.content);
      setType(question.type);
      setDifficulty(question.difficulty);
    } else {
      setContent("");
      setType(QUESTION_TYPES.MULTIPLE_CHOICE);
      setDifficulty(DIFFICULTY_LEVELS.EASY);
    }
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Nội dung câu hỏi không được để trống.");
      return;
    }
    setError("");

    const questionData = {
      ...(question || {}), // Safe spread cho trường hợp question null
      content,
      type,
      difficulty,
    };

    onSubmit(questionData);
    onClose(); // Close after submission
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {question ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nội dung câu hỏi
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="Nhập nội dung câu hỏi..."
              required
            ></textarea>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loại câu hỏi
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Độ khó
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              {question ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
