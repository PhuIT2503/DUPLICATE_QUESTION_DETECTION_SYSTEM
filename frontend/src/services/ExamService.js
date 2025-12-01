import axios from 'axios';

export const getExamFeedbacks = async (examId) => {
  const response = await axios.get(`/api/exams/${examId}/feedbacks`);
  return response.data;
};

export const submitFeedback = async (examId, { content, rating }) => {
  const response = await axios.post(`/api/exams/${examId}/feedbacks`, {
    content,
    rating
  });
  return response.data;
};