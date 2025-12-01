import { useState } from 'react';
import RatingStars from './RatingStars';
import { submitFeedback } from '@/services/examService';

export default function FeedbackForm({ examId, onSuccess }) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const newFeedback = await submitFeedback(examId, { content, rating });
      onSuccess(newFeedback);
      setContent('');
      setRating(5);
    } catch (err) {
      setError(err.message || 'Gửi feedback thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Gửi Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Đánh giá:</label>
          <RatingStars value={rating} onChange={setRating} />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Nhận xét:</label>
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={submitting}
        >
          {submitting ? 'Đang gửi...' : 'Gửi Feedback'}
        </button>
      </form>
    </div>
  );
}