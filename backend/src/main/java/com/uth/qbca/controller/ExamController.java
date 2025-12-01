package com.uth.qbca.controller;

import com.uth.qbca.dto.ExamDTO;
import com.uth.qbca.dto.ExamRequestDTO;
import com.uth.qbca.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*")
public class ExamController {

    @Autowired
    private ExamService examService;

    @PostMapping("/generate")
    public ResponseEntity<ExamDTO> generateExam(@RequestBody ExamRequestDTO request) {
        return ResponseEntity.ok(examService.generateExam(request));
    }
}
