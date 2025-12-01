package com.uth.qbca.controller;

import com.uth.qbca.dto.SubmissionDTO;
import com.uth.qbca.model.ExamSubmission;
import com.uth.qbca.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class ExamSubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<ExamSubmission> submitExam(@RequestBody SubmissionDTO dto) {
        ExamSubmission result = submissionService.createSubmission(dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExamSubmission>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(submissionService.getByUser(userId));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<ExamSubmission>> getBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(submissionService.getBySubject(subjectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamSubmission> getById(@PathVariable Long id) {
        ExamSubmission submission = submissionService.getById(id);
        return (submission != null) ? ResponseEntity.ok(submission) : ResponseEntity.notFound().build();
    }
}
