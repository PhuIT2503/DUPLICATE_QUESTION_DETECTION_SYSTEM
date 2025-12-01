// package com.uth.qbca.controller;

// import com.uth.qbca.dto.ReportDTO;
// import com.uth.qbca.dto.StatisticDTO;
// import com.uth.qbca.service.ReportService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.*;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/reports")
// @RequiredArgsConstructor
// @CrossOrigin(origins = "*")
// public class ReportController {

//     // Inject ReportService để xử lý logic thống kê, xuất báo cáo
//     private final ReportService reportService;

//     /**
//      * API trả về báo cáo tổng quan (tổng số đề, tổng số câu hỏi, tỷ lệ độ khó)
//      */
//     @GetMapping("/summary")
//     public ResponseEntity<ReportDTO> getSummary() {
//         return ResponseEntity.ok(reportService.generateReport());
//     }

//     /**
//      * API trả về thống kê chi tiết (số lượng câu hỏi từng mức độ, phần trăm, ...)
//      */
//     @GetMapping("/statistics")
//     public ResponseEntity<StatisticDTO> getStatistics() {
//         return ResponseEntity.ok(reportService.getStatistics());
//     }

//     /**
//      * API xuất báo cáo tổng quan ra file PDF để tải về
//      */
//     @GetMapping("/export/pdf")
//     public ResponseEntity<byte[]> exportPDF() {
//         byte[] pdf = reportService.exportReportToPDF();

//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentType(MediaType.APPLICATION_PDF);
//         headers.setContentDisposition(ContentDisposition.builder("attachment")
//                 .filename("report.pdf").build());

//         return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
//     }
// }