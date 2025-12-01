import React from "react";
import { XCircle, FileDown } from "lucide-react";

const AIResultModal = ({ results, onClose, onExportPDF }) => {
  console.log("AI Results: ", results); // Log để kiểm tra kết quả

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Kết quả kiểm tra trùng lặp</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {results?.map((result, index) => (
          <div key={index} className="border border-gray-300 rounded-md p-4 mb-4">
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Câu hỏi:</span> {result.input || "Không có câu hỏi"}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Trạng thái:</span>{" "}
              <span
                className={
                  result.status === "duplicate"
                    ? "text-red-600 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                {result.status === "duplicate" ? "Trùng lặp" : "Không trùng lặp"}
              </span>
            </p>

            {result.duplicates?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-collapse mt-2">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="border px-3 py-2">Câu hỏi trùng</th>
                      <th className="border px-3 py-2">Độ tương đồng</th>
                      <th className="border px-3 py-2">Tác giả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.duplicates.map((dup, i) => (
                      <tr key={i}>
                        <td className="border px-3 py-2 text-gray-700">
                          {dup.matchedQuestion || dup.text}
                        </td>
                        <td className="border px-3 py-2 text-gray-700">
                          {(dup.similarity * 100).toFixed(2)}%
                        </td>
                        <td className="border px-3 py-2 text-gray-700">
                          {dup.createdBy || "Không rõ"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">Không tìm thấy câu hỏi trùng lặp.</p>
            )}
          </div>
        ))}

        {onExportPDF && (
          <button
            onClick={onExportPDF}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FileDown className="w-5 h-5 mr-2" />
            Xuất PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default AIResultModal;
