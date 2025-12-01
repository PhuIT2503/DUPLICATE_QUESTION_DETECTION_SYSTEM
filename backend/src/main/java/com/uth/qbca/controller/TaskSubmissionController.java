package com.uth.qbca.controller;

import com.uth.qbca.dto.FeedbackRequest;
import com.uth.qbca.model.TaskSubmission;
import com.uth.qbca.service.TaskSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/task-submissions")
public class TaskSubmissionController {

    @Autowired
    private TaskSubmissionService submissionService;

    /**
     * Nộp file cho assignment
     */
    @PostMapping("/upload/{assignmentId}")
    @PreAuthorize("hasRole('LECTURER') or hasRole('SUBJECT_HEAD')")
    public ResponseEntity<TaskSubmission> submitFile(
            @PathVariable Long assignmentId,
            @RequestParam("file") MultipartFile file) {
        try {
            TaskSubmission submission = submissionService.submitFile(assignmentId, file);
            return ResponseEntity.ok(submission);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy danh sách submissions của một assignment (chỉ cho người giao nhiệm vụ)
     */
    @GetMapping("/assignment/{assignmentId}")
    @PreAuthorize("hasRole('SUBJECT_HEAD') or hasRole('DEPARTMENT_HEAD') or hasRole('EXAM_OFFICE_HEAD') or hasRole('RD_STAFF')")
    public ResponseEntity<List<TaskSubmission>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        List<TaskSubmission> submissions = submissionService.getSubmissionsByAssignment(assignmentId);
        return ResponseEntity.ok(submissions);
    }

    /**
     * Lấy danh sách submissions của user hiện tại (chỉ cho người nộp bài)
     */
    @GetMapping("/my-submissions")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<List<TaskSubmission>> getMySubmissions(@RequestParam Long userId) {
        List<TaskSubmission> submissions = submissionService.getSubmissionsByUser(userId);
        return ResponseEntity.ok(submissions);
    }

    /**
     * Duyệt submission
     */
    @PostMapping("/{submissionId}/approve")
    @PreAuthorize("hasRole('SUBJECT_HEAD') or hasRole('DEPARTMENT_HEAD') or hasRole('EXAM_OFFICE_HEAD') or hasRole('RD_STAFF')")
    public ResponseEntity<TaskSubmission> approveSubmission(
            @PathVariable Long submissionId,
            @RequestBody FeedbackRequest request) {
        TaskSubmission submission = submissionService.approveSubmission(submissionId, request.getReviewerId(), request.getFeedback());
        return ResponseEntity.ok(submission);
    }

    /**
     * Từ chối submission
     */
    @PostMapping("/{submissionId}/reject")
    @PreAuthorize("hasRole('SUBJECT_HEAD') or hasRole('DEPARTMENT_HEAD') or hasRole('EXAM_OFFICE_HEAD') or hasRole('RD_STAFF')")
    public ResponseEntity<TaskSubmission> rejectSubmission(
            @PathVariable Long submissionId,
            @RequestBody FeedbackRequest request) {
        TaskSubmission submission = submissionService.rejectSubmission(submissionId, request.getReviewerId(), request.getFeedback());
        return ResponseEntity.ok(submission);
    }

    /**
     * Yêu cầu chỉnh sửa submission
     */
    @PostMapping("/{submissionId}/revision")
    @PreAuthorize("hasRole('SUBJECT_HEAD') or hasRole('DEPARTMENT_HEAD') or hasRole('EXAM_OFFICE_HEAD') or hasRole('RD_STAFF')")
    public ResponseEntity<TaskSubmission> requestRevision(
            @PathVariable Long submissionId,
            @RequestBody FeedbackRequest request) {
        TaskSubmission submission = submissionService.requestRevision(submissionId, request.getReviewerId(), request.getFeedback());
        return ResponseEntity.ok(submission);
    }

    /**
     * Download file submission (người giao nhiệm vụ download bất kỳ file nào, người nộp chỉ download file của mình)
     */
    @GetMapping("/download/{submissionId}")
    @PreAuthorize("hasRole('LECTURER') or hasRole('SUBJECT_HEAD') or hasRole('DEPARTMENT_HEAD') or hasRole('EXAM_OFFICE_HEAD') or hasRole('RD_STAFF')")
    public ResponseEntity<Resource> downloadSubmission(@PathVariable Long submissionId) {
        try {
            File file = submissionService.getSubmissionFile(submissionId);
            Resource resource = new FileSystemResource(file);
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xóa submission (chỉ người nộp có thể xóa submission của mình)
     */
    @DeleteMapping("/{submissionId}")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<Void> deleteSubmission(@PathVariable Long submissionId) {
        submissionService.deleteSubmission(submissionId);
        return ResponseEntity.ok().build();
    }

    /**
     * Lấy submissions cần review cho reviewer
     */
    @GetMapping("/pending-review")
    @PreAuthorize("hasRole('SUBJECT_HEAD') or hasRole('DEPARTMENT_HEAD') or hasRole('EXAM_OFFICE_HEAD') or hasRole('RD_STAFF')")
    public ResponseEntity<List<TaskSubmission>> getPendingSubmissions(@RequestParam Long reviewerId) {
        List<TaskSubmission> submissions = submissionService.getPendingSubmissionsForReviewer(reviewerId);
        return ResponseEntity.ok(submissions);
    }

    /**
     * Kiểm tra user có pending submissions không
     */
    @GetMapping("/check-pending")
    @PreAuthorize("hasRole('LECTURER') or hasRole('SUBJECT_HEAD')")
    public ResponseEntity<Map<String, Boolean>> checkPendingSubmissions(@RequestParam Long userId) {
        boolean hasPending = submissionService.hasPendingSubmissions(userId);
        return ResponseEntity.ok(Map.of("hasPending", hasPending));
    }
}
