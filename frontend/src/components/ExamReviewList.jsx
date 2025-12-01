import React, { useEffect, useState } from "react";
import ExamService from "../services/ExamService";

const ExamReviewList = ({ user }) => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    ExamService.getSubmissionsByUser(user.id).then((res) => setSubmissions(res.data));
  }, [user.id]);

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-lg font-bold mb-2">Danh sách đề thi của bạn</h2>
      <ul className="space-y-2">
        {submissions.map((sub) => (
          <li key={sub.id} className="border p-3 rounded hover:bg-gray-50">
            <p><strong>Mã đề:</strong> {sub.examId}</p>
            <p><strong>Môn:</strong> {sub.subjectId}</p>
            <p><strong>Trạng thái:</strong> {sub.status || "Chờ duyệt"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamReviewList;