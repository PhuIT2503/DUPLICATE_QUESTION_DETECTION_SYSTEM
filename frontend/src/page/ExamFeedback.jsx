import { useState, useEffect } from 'react';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';
import { getExamFeedbacks } from '@/services/examService';

export default function ExamFeedback({ examId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await getExamFeedbacks(examId);
        setFeedbacks(data);
      } catch (error) {
        console.error('Lỗi tải feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFeedbacks();
  }, [examId]);

  const handleNewFeedback = (newFeedback) => {
    setFeedbacks([newFeedback, ...feedbacks]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Feedback Đề Thi</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FeedbackList feedbacks={feedbacks} loading={loading} />
        </div>
        <div>
          <FeedbackForm examId={examId} onSuccess={handleNewFeedback} />
        </div>
      </div>
    </div>
  );
}