export default function FeedbackList({ feedbacks, loading }) {
  if (loading) {
    return <div>Đang tải feedback...</div>;
  }

  if (feedbacks.length === 0) {
    return <div>Chưa có feedback nào</div>;
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {new Date(feedback.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700">{feedback.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            - {feedback.user?.name || 'Ẩn danh'}
          </div>
        </div>
      ))}
    </div>
  );
}