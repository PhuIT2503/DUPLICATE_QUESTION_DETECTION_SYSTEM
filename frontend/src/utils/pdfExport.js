import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportAIReportToPDF = (aiAnalysisResults) => {
  if (!aiAnalysisResults.length) {
    console.warn("No AI analysis results to export");
    return;
  }

  const doc = new jsPDF();

  aiAnalysisResults.forEach((result, idx) => {
    if (idx > 0) doc.addPage();

    // Header
    doc.setFontSize(16);
    doc.text("AI Duplicate Detection Report", 14, 20);

    // Question info
    doc.setFontSize(12);
    doc.text(`Câu hỏi: ${result.input}`, 14, 30);
    doc.text(
      `Trạng thái: ${
        result.status === "duplicate" ? "Trùng lặp" : "Không trùng lặp"
      }`,
      14,
      40
    );

    // Duplicates table
    if (result.duplicates && result.duplicates.length > 0) {
      autoTable(doc, {
        startY: 50,
        head: [["Câu hỏi trùng", "Độ tương đồng"]],
        body: result.duplicates.map((item) => [
          item.text,
          `${(item.similarity * 100).toFixed(2)}%`,
        ]),
      });
    } else {
      doc.text("Không tìm thấy câu hỏi trùng lặp.", 14, 50);
    }
  });

  const filename = `ai_duplicate_report_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(filename);
};
