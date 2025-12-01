import React, { useState } from "react";
import QuestionCard from "../../components/QuestionCard";
import QuestionForm from "../../components/QuestionForm";
import UploadQuestions from "../../components/UploadQuestions";
import AIResultModal from "../../components/AIResultModal";
import { PlusCircle, Search, RefreshCcw } from "lucide-react";
import { useQuestions } from "../../hooks/useQuestions";
import { useAIDuplicateDetection } from "../../hooks/useAIDuplicateDetection";
import { useQuestionFormModal } from "../../hooks/useQuestionFormModal";
import { exportAIReportToPDF } from "../../utils/pdfExport";

const QuestionsPage = ({ user }) => {
  // Local state for search and manual check
  const [searchTerm, setSearchTerm] = useState("");
  const [manualCheckContent, setManualCheckContent] = useState("");

  // Custom hooks for clean separation of concerns
  const {
    questions,
    loading: questionsLoading,
    error: questionsError,
    setError: setQuestionsError,
    fetchQuestions,
    saveQuestion,
    deleteQuestion,
    filterQuestions,
  } = useQuestions();

  const {
    loading: aiLoading,
    error: aiError,
    setError: setAiError,
    aiAnalysisResults,
    showAIResultModal,
    analyzeDuplicates,
    checkManualDuplicate,
    closeModal,
  } = useAIDuplicateDetection(user);

  const {
    showQuestionForm,
    editingQuestion,
    openAddForm,
    openEditForm,
    closeForm,
  } = useQuestionFormModal();

  // Combined loading and error states
  const loading = questionsLoading || aiLoading;
  const error = questionsError || aiError;

  // Clear all errors
  const clearErrors = () => {
    setQuestionsError("");
    setAiError("");
  };

  // Handle question save with form closing
  const handleSaveQuestion = async (questionData) => {
    const result = await saveQuestion(questionData);
    if (result.success) {
      closeForm();
    }
  };

  // Handle manual duplicate check
  const handleManualCheck = async () => {
    await checkManualDuplicate(manualCheckContent);
  };

  // Export AI report
  const handleExportPDF = () => {
    exportAIReportToPDF(aiAnalysisResults);
  };

  // Get filtered questions
  const filteredQuestions = filterQuestions(searchTerm);

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Ngân hàng câu hỏi
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Lỗi: </strong>
          <span className="block sm:inline">{error}</span>
          <button onClick={clearErrors} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <span className="sr-only">Đóng</span>×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Thêm câu hỏi mới</h3>
              <p className="text-gray-600 text-sm">Tạo một câu hỏi riêng lẻ.</p>
            </div>
            <button
              onClick={openAddForm}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Thêm câu hỏi
            </button>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Nhập câu hỏi để kiểm tra trùng lặp..."
              value={manualCheckContent}
              onChange={(e) => setManualCheckContent(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleManualCheck}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
            >
              Kiểm tra
            </button>
          </div>
        </div>

        <UploadQuestions onAnalyzeDuplicates={analyzeDuplicates} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách câu hỏi</h2>

        <div className="flex items-center space-x-3 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm theo nội dung câu hỏi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 pl-10 outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            onClick={fetchQuestions}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
            title="Làm mới danh sách"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Làm mới
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-teal-600">Đang tải câu hỏi...</div>
        ) : filteredQuestions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Không tìm thấy câu hỏi nào khớp với "{searchTerm}".</p>
        ) : (
          filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} onEdit={openEditForm} onDelete={deleteQuestion} />
          ))
        )}
      </div>

      {showQuestionForm && (
        <QuestionForm question={editingQuestion} onClose={closeForm} onSubmit={handleSaveQuestion} />
      )}

      {showAIResultModal && (
        <AIResultModal results={aiAnalysisResults} onClose={closeModal} onExportPDF={handleExportPDF} />
      )}
    </div>
  );
};

export default QuestionsPage;
