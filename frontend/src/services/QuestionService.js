import api from "../api/axiosapi";

const QuestionService = {
  getQuestions: () => api.get("/questions"),
  getQuestionById: (id) => api.get(`/questions/${id}`),
  createQuestion: (data) => api.post("/questions", data),
  updateQuestion: (id, data) => api.put(`/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/questions/${id}`),

  // ✅ Hàm kiểm tra trùng lặp (truyền đủ 4 field)
  checkDuplicate: ({ user_id, question, difficulty, question_type }) => {
    return api.post("/duplicate-detection/check-duplicate", {
      user_id,
      question,
      difficulty,
      question_type,
    });
  },
};

export default QuestionService;
