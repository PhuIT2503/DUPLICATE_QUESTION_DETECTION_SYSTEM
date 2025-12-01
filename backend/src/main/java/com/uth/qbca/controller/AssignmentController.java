package com.uth.qbca.controller;

import com.uth.qbca.model.TaskAssignment;
import com.uth.qbca.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {
    private static final Logger logger = LoggerFactory.getLogger(AssignmentController.class);
    
    @Autowired
    private AssignmentService assignmentService;

    // Lấy tất cả assignments
    @GetMapping
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD')")
    public List<TaskAssignment> getAllAssignments() {
        logger.info("Fetching all assignments");
        
        // Debug: Log current user info
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            logger.info("Current user: {}", auth.getName());
            logger.info("Current authorities: {}", auth.getAuthorities().toString());
        } else {
            logger.warn("No authentication found!");
        }
        
        return assignmentService.getAllAssignments();
    }

    // Lấy assignment theo ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD')")
    public ResponseEntity<TaskAssignment> getAssignmentById(@PathVariable Long id) {
        logger.info("Fetching assignment with id: {}", id);
        Optional<TaskAssignment> assignment = assignmentService.getAssignmentById(id);
        return assignment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Lấy assignments theo user ID
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('LECTURER') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD')")
    public ResponseEntity<List<TaskAssignment>> getAssignmentsByUserId(@PathVariable Long userId) {
        logger.info("Fetching assignments for user id: {}", userId);
        List<TaskAssignment> assignments = assignmentService.getAssignmentsByUserId(userId);
        return ResponseEntity.ok(assignments);
    }

    // Lấy assignments của user hiện tại (my-tasks)
    @GetMapping("/my-tasks")
    @PreAuthorize("hasRole('LECTURER') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD') or hasRole('EXAM_OFFICE_HEAD')")
    public ResponseEntity<List<TaskAssignment>> getMyTasks(@RequestParam String userId) {
        logger.info("Fetching tasks for user: {}", userId);
        
        if (userId == null || userId.trim().isEmpty()) {
            logger.error("User ID is null or empty");
            return ResponseEntity.badRequest().build();
        }
        
        try {
            // Thử convert sang Long nếu là số
            Long userIdLong = Long.parseLong(userId);
            List<TaskAssignment> assignments = assignmentService.getAssignmentsByUserId(userIdLong);
            return ResponseEntity.ok(assignments);
        } catch (NumberFormatException e) {
            // Nếu không phải số, tìm user bằng userCode
            logger.info("User ID is not numeric, treating as userCode: {}", userId);
            List<TaskAssignment> assignments = assignmentService.getAssignmentsByUserCode(userId);
            return ResponseEntity.ok(assignments);
        }
    }

    // Lấy assignments theo subject ID
    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN')")
    public ResponseEntity<List<TaskAssignment>> getAssignmentsBySubjectId(@PathVariable Long subjectId) {
        logger.info("Fetching assignments for subject id: {}", subjectId);
        List<TaskAssignment> assignments = assignmentService.getAssignmentsBySubjectId(subjectId);
        return ResponseEntity.ok(assignments);
    }

    // Lấy assignments theo user và subject
    @GetMapping("/user/{userId}/subject/{subjectId}")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('LECTURER')")
    public ResponseEntity<List<TaskAssignment>> getAssignmentsByUserAndSubject(
            @PathVariable Long userId, 
            @PathVariable Long subjectId) {
        logger.info("Fetching assignments for user id: {} and subject id: {}", userId, subjectId);
        List<TaskAssignment> assignments = assignmentService.getAssignmentsByUserAndSubject(userId, subjectId);
        return ResponseEntity.ok(assignments);
    }

    // Lấy assignments theo trạng thái hoàn thành
    @GetMapping("/status/{completed}")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN')")
    public ResponseEntity<List<TaskAssignment>> getAssignmentsByStatus(@PathVariable Boolean completed) {
        logger.info("Fetching assignments with completed status: {}", completed);
        List<TaskAssignment> assignments = assignmentService.getAssignmentsByCompleted(completed);
        return ResponseEntity.ok(assignments);
    }

    // Lấy assignments sắp đến deadline
    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN')")
    public ResponseEntity<List<TaskAssignment>> getUpcomingAssignments(
            @RequestParam(defaultValue = "7") int days) {
        logger.info("Fetching upcoming assignments within {} days", days);
        List<TaskAssignment> assignments = assignmentService.getUpcomingAssignments(days);
        return ResponseEntity.ok(assignments);
    }

    // Lấy assignments quá hạn
    @GetMapping("/overdue")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN')")
    public ResponseEntity<List<TaskAssignment>> getOverdueAssignments() {
        logger.info("Fetching overdue assignments");
        List<TaskAssignment> assignments = assignmentService.getOverdueAssignments();
        return ResponseEntity.ok(assignments);
    }

    // Lấy assignments theo khoảng thời gian deadline
    @GetMapping("/deadline-range")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN')")
    public ResponseEntity<List<TaskAssignment>> getAssignmentsByDeadlineRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        logger.info("Fetching assignments with deadline between {} and {}", startDate, endDate);
        List<TaskAssignment> assignments = assignmentService.getAssignmentsByDeadlineRange(startDate, endDate);
        return ResponseEntity.ok(assignments);
    }

    // Tìm kiếm assignments theo tên task
    @GetMapping("/search")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN')")
    public ResponseEntity<List<TaskAssignment>> searchAssignmentsByTaskName(
            @RequestParam String taskName) {
        logger.info("Searching assignments by task name: {}", taskName);
        List<TaskAssignment> assignments = assignmentService.searchAssignmentsByTaskName(taskName);
        return ResponseEntity.ok(assignments);
    }

    // Lấy thống kê assignments theo user
    @GetMapping("/stats/user/{userId}")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('LECTURER')")
    public ResponseEntity<AssignmentService.AssignmentStats> getAssignmentStatsByUserId(@PathVariable Long userId) {
        logger.info("Fetching assignment stats for user id: {}", userId);
        AssignmentService.AssignmentStats stats = assignmentService.getAssignmentStatsByUserId(userId);
        return ResponseEntity.ok(stats);
    }

    // Lấy số lượng assignments theo subject
    @GetMapping("/count/subject/{subjectId}")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN')")
    public ResponseEntity<Long> getAssignmentCountBySubjectId(@PathVariable Long subjectId) {
        logger.info("Fetching assignment count for subject id: {}", subjectId);
        long count = assignmentService.getAssignmentCountBySubjectId(subjectId);
        return ResponseEntity.ok(count);
    }

    // Tạo assignment mới
    @PostMapping
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD')")
    public ResponseEntity<TaskAssignment> createAssignment(@RequestBody TaskAssignment assignment) {
        try {
            logger.info("Creating new assignment: {}", assignment.getTaskName());
            logger.debug("Assignment details - TaskName: {}, Description: {}, UserId: {}, SubjectId: {}, StartDate: {}, Deadline: {}", 
                assignment.getTaskName(), assignment.getDescription(), assignment.getUserId(), 
                assignment.getSubject() != null ? assignment.getSubject().getId() : null,
                assignment.getStartDate(), assignment.getDeadline());
            
            // Sử dụng method mới có thông báo
            TaskAssignment savedAssignment = assignmentService.createAssignment(assignment);
            logger.info("Assignment created successfully with id: {}", savedAssignment.getId());
            return ResponseEntity.ok(savedAssignment);
        } catch (Exception e) {
            logger.error("Error creating assignment: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật assignment
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD')")
    public ResponseEntity<TaskAssignment> updateAssignment(@PathVariable Long id, @RequestBody TaskAssignment assignment) {
        try {
            logger.info("Updating assignment with id: {}", id);
            assignment.setId(id);
            TaskAssignment updatedAssignment = assignmentService.saveAssignment(assignment);
            return ResponseEntity.ok(updatedAssignment);
        } catch (Exception e) {
            logger.error("Error updating assignment: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Cập nhật trạng thái hoàn thành
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('LECTURER')")
    public ResponseEntity<TaskAssignment> updateAssignmentStatus(
            @PathVariable Long id, 
            @RequestParam Boolean completed) {
        try {
            logger.info("Updating assignment status with id: {} to {}", id, completed);
            // Sử dụng method mới có thông báo
            TaskAssignment updatedAssignment = assignmentService.updateAssignmentStatus(id, completed);
            return ResponseEntity.ok(updatedAssignment);
        } catch (Exception e) {
            logger.error("Error updating assignment status: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Xóa assignment
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD') or hasRole('SUBJECT_HEAD')")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        logger.info("Deleting assignment with id: {}", id);
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }

    // Duyệt nhiệm vụ
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD')")
    public ResponseEntity<String> approveAssignment(@PathVariable Long id) {
        try {
            logger.info("Approving assignment with id: {}", id);
            assignmentService.notifyTaskApproved(id);
            return ResponseEntity.ok("Assignment approved successfully");
        } catch (Exception e) {
            logger.error("Error approving assignment: ", e);
            return ResponseEntity.badRequest().body("Error approving assignment");
        }
    }

    // Từ chối nhiệm vụ
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN') or hasRole('DEPARTMENT_HEAD')")
    public ResponseEntity<String> rejectAssignment(
            @PathVariable Long id, 
            @RequestParam(required = false) String reason) {
        try {
            logger.info("Rejecting assignment with id: {} with reason: {}", id, reason);
            assignmentService.notifyTaskRejected(id, reason);
            return ResponseEntity.ok("Assignment rejected successfully");
        } catch (Exception e) {
            logger.error("Error rejecting assignment: ", e);
            return ResponseEntity.badRequest().body("Error rejecting assignment");
        }
    }

    // Kiểm tra và gửi thông báo nhiệm vụ sắp đến hạn
    @PostMapping("/check-upcoming")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN')")
    public ResponseEntity<String> checkUpcomingTasks() {
        try {
            logger.info("Checking for upcoming tasks");
            assignmentService.checkAndNotifyUpcomingTasks();
            return ResponseEntity.ok("Upcoming tasks checked and notifications sent");
        } catch (Exception e) {
            logger.error("Error checking upcoming tasks: ", e);
            return ResponseEntity.badRequest().body("Error checking upcoming tasks");
        }
    }

    // Kiểm tra và gửi thông báo nhiệm vụ quá hạn
    @PostMapping("/check-overdue")
    @PreAuthorize("hasRole('RD_STAFF') or hasRole('RD_ADMIN')")
    public ResponseEntity<String> checkOverdueTasks() {
        try {
            logger.info("Checking for overdue tasks");
            assignmentService.checkAndNotifyOverdueTasks();
            return ResponseEntity.ok("Overdue tasks checked and notifications sent");
        } catch (Exception e) {
            logger.error("Error checking overdue tasks: ", e);
            return ResponseEntity.badRequest().body("Error checking overdue tasks");
        }
    }

    // Test endpoint - không cần authentication
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Assignment API is working!");
    }
    
    // Test endpoint cho DEPARTMENT_HEAD
    @GetMapping("/test-dept-head")
    @PreAuthorize("hasRole('DEPARTMENT_HEAD')")
    public ResponseEntity<String> testDeptHead() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String message = String.format("DEPARTMENT_HEAD test successful! User: %s, Authorities: %s", 
                                      auth.getName(), auth.getAuthorities().toString());
        logger.info(message);
        return ResponseEntity.ok(message);
    }

    // Test endpoint - lấy danh sách assignments mà không cần authentication (chỉ để debug)
    @GetMapping("/public")
    public ResponseEntity<List<TaskAssignment>> getPublicAssignments() {
        try {
            logger.info("Fetching assignments for public test");
            List<TaskAssignment> assignments = assignmentService.getAllAssignments();
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            logger.error("Error fetching public assignments: ", e);
            return ResponseEntity.status(500).body(null);
        }
    }
}
