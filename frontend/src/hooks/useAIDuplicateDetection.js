import { useState } from "react";
import api from "../api/axiosapi";
import QuestionService from "../services/QuestionService";
import { AGENCY_ROLES } from "../constants/questionConstants";

export const useAIDuplicateDetection = (user) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiAnalysisResults, setAiAnalysisResults] = useState([]);
  const [showAIResultModal, setShowAIResultModal] = useState(false);

  const analyzeDuplicates = async (questionOrResults) => {
    setLoading(true);
    setError("");

    try {
      if (Array.isArray(questionOrResults)) {
        setAiAnalysisResults(questionOrResults);
        setShowAIResultModal(true);
        return;
      }

      const isAgencyUser = AGENCY_ROLES.includes(user?.role);

      const res = isAgencyUser
        ? await api.post("/duplicate-detection/agency-register", questionOrResults)
        : await QuestionService.checkDuplicate(questionOrResults);

      const status = isAgencyUser
        ? res.data.is_new_question
          ? "unique"
          : "duplicate"
        : res.data.status;

      const duplicates = isAgencyUser
        ? res.data.similar_found || []
        : res.data.data || [];

      setAiAnalysisResults([{
        input: questionOrResults.question,
        status,
        duplicates: duplicates.map((item) => ({
          text: item.matchedQuestion || item.text,
          similarity: item.similarity,
          createdBy: item.createdBy || item.created_by || "Không rõ",
        })),
      }]);

      setShowAIResultModal(true);
    } catch (err) {
      setError("Không thể kiểm tra trùng lặp AI.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkManualDuplicate = async (content) => {
    if (!content.trim()) return;

    await analyzeDuplicates({
      question: content,
      user_id: user?.id || user?.userId || "manual",
    });
  };

  const checkFileDuplicates = async (file) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/duplicate-detection/check-file", formData);
      const data = res.data.results || [];

      const normalizedResults = data.map((item) => ({
        input: item.question || "Câu hỏi không xác định",
        status: item.status || "unknown",
        duplicates: (item.duplicates || item.matches || []).map((dup) => ({
          text: dup.text || dup.matchedQuestion,
          similarity: dup.similarity,
          createdBy: dup.createdBy || dup.created_by || "Không rõ",
        })),
      }));

      setAiAnalysisResults(normalizedResults);
      setShowAIResultModal(true);
    } catch (err) {
      setError("Không thể kiểm tra file.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowAIResultModal(false);
    setAiAnalysisResults([]);
  };

  return {
    loading,
    error,
    setError,
    aiAnalysisResults,
    showAIResultModal,
    analyzeDuplicates,
    checkManualDuplicate,
    checkFileDuplicates, // <- bổ sung export
    closeModal,
  };
};
