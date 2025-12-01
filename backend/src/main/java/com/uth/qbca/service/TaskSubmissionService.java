package com.uth.qbca.service;

import com.uth.qbca.model.TaskAssignment;
import com.uth.qbca.model.TaskSubmission;
import com.uth.qbca.model.TaskSubmission.SubmissionStatus;
import com.uth.qbca.model.User;
import com.uth.qbca.repository.TaskSubmissionRepository;
import com.uth.qbca.repository.TaskAssignmentRepository;
import com.uth.qbca.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TaskSubmissionService {

    @Autowired
    private TaskSubmissionRepository submissionRepository;
    
    @Autowired
    private TaskAssignmentRepository assignmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    private final String uploadDir = "uploads/assignments/";

    /**
     * Nộp file cho assignment
     */
    public TaskSubmission submitFile(Long assignmentId, MultipartFile file) throws IOException {
        TaskAssignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        // Tạo thư mục nếu chưa có
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Tạo tên file unique
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Lưu file
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);
        
        // Tạo record submission
        TaskSubmission submission = new TaskSubmission(
            assignment,
            originalFileName,
            filePath.toString(),
            file.getContentType(),
            file.getSize()
        );
        
        TaskSubmission savedSubmission = submissionRepository.save(submission);
        
        // Gửi thông báo cho người giao nhiệm vụ
        if (assignment.getAssignedBy() != null) {
            User submitter = userRepository.findById(assignment.getUserId()).orElse(null);
            String submitterName = submitter != null ? submitter.getLastName() + " " + submitter.getFirstName() : "Không rõ";
            
            notificationService.notifyFileSubmitted(
                assignment.getAssignedBy(),
                assignment.getTaskName(),
                submitterName,
                1
            );
        }
        
        return savedSubmission;
    }

    /**
     * Lấy danh sách submissions của một assignment
     */
    public List<TaskSubmission> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentIdOrderBySubmittedAtDesc(assignmentId);
    }

    /**
     * Lấy danh sách submissions của user
     */
    public List<TaskSubmission> getSubmissionsByUser(Long userId) {
        return submissionRepository.findByUserIdOrderBySubmittedAtDesc(userId);
    }

    /**
     * Duyệt file submission
     */
    public TaskSubmission approveSubmission(Long submissionId, Long reviewerId, String feedback) {
        TaskSubmission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
        
        submission.setStatus(SubmissionStatus.APPROVED);
        submission.setFeedback(feedback);
        submission.setReviewedAt(LocalDateTime.now());
        submission.setReviewedBy(reviewerId);
        
        TaskSubmission updatedSubmission = submissionRepository.save(submission);
        
        // Gửi thông báo cho người nộp
        notificationService.notifyFileApproved(
            submission.getAssignment().getUserId(),
            submission.getAssignment().getTaskName(),
            submission.getFileName()
        );
        
        return updatedSubmission;
    }

    /**
     * Từ chối file submission
     */
    public TaskSubmission rejectSubmission(Long submissionId, Long reviewerId, String feedback) {
        TaskSubmission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
        
        submission.setStatus(SubmissionStatus.REJECTED);
        submission.setFeedback(feedback);
        submission.setReviewedAt(LocalDateTime.now());
        submission.setReviewedBy(reviewerId);
        
        TaskSubmission updatedSubmission = submissionRepository.save(submission);
        
        // Gửi thông báo cho người nộp
        notificationService.notifyFileRejected(
            submission.getAssignment().getUserId(),
            submission.getAssignment().getTaskName(),
            submission.getFileName(),
            feedback
        );
        
        return updatedSubmission;
    }

    /**
     * Yêu cầu chỉnh sửa file submission
     */
    public TaskSubmission requestRevision(Long submissionId, Long reviewerId, String feedback) {
        TaskSubmission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
        
        submission.setStatus(SubmissionStatus.REVISION);
        submission.setFeedback(feedback);
        submission.setReviewedAt(LocalDateTime.now());
        submission.setReviewedBy(reviewerId);
        
        TaskSubmission updatedSubmission = submissionRepository.save(submission);
        
        // Gửi thông báo phản hồi
        notificationService.notifyFeedbackReceived(
            submission.getAssignment().getUserId(),
            submission.getAssignment().getTaskName(),
            feedback
        );
        
        return updatedSubmission;
    }

    /**
     * Lấy submissions cần review cho người giao nhiệm vụ
     */
    public List<TaskSubmission> getPendingSubmissionsForReviewer(Long reviewerId) {
        return submissionRepository.findPendingSubmissionsByAssigner(reviewerId);
    }

    /**
     * Xóa file submission
     */
    public void deleteSubmission(Long submissionId) {
        TaskSubmission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
        
        // Xóa file vật lý
        try {
            Path filePath = Paths.get(submission.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Could not delete file: " + e.getMessage());
        }
        
        // Xóa record
        submissionRepository.delete(submission);
    }

    /**
     * Download file submission
     */
    public File getSubmissionFile(Long submissionId) {
        TaskSubmission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
        
        File file = new File(submission.getFilePath());
        if (!file.exists()) {
            throw new RuntimeException("File not found on disk");
        }
        
        return file;
    }

    /**
     * Kiểm tra user có submissions đang pending không
     */
    public boolean hasPendingSubmissions(Long userId) {
        return submissionRepository.hasPendingSubmissions(userId);
    }
}
