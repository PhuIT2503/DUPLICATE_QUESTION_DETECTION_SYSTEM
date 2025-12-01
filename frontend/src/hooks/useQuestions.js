import { useState, useEffect } from "react";
import QuestionService from "../services/QuestionService";

export const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await QuestionService.getQuestions();
      setQuestions(res.data);
    } catch (err) {
      setError("Không thể tải danh sách câu hỏi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create or update question
  const saveQuestion = async (questionData) => {
    setLoading(true);
    setError("");

    try {
      console.log("Saving question data:", questionData);

      const res = questionData.id
        ? await QuestionService.updateQuestion(questionData.id, questionData)
        : await QuestionService.createQuestion(questionData);

      console.log("API response:", res.data);

      setQuestions((prev) =>
        questionData.id
          ? prev.map((q) => (q.id === res.data.id ? res.data : q))
          : [...prev, res.data]
      );

      return { success: true, data: res.data };
    } catch (err) {
      console.error("Error saving question:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi không xác định";
      setError(
        `Không thể ${
          questionData.id ? "cập nhật" : "thêm"
        } câu hỏi: ${errorMessage}`
      );
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete question
  const deleteQuestion = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này không?"))
      return false;

    setLoading(true);
    try {
      await QuestionService.deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      return true;
    } catch (err) {
      setError("Không thể xóa câu hỏi.");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Filter questions by search term
  const filterQuestions = (searchTerm) => {
    return questions.filter(
      (q) =>
        typeof q.content === "string" &&
        q.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Load questions on mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    loading,
    error,
    setError,
    fetchQuestions,
    saveQuestion,
    deleteQuestion,
    filterQuestions,
  };
};
