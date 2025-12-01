package com.uth.qbca.service;

import com.uth.qbca.model.TaskAssignment;
import com.uth.qbca.model.Subject;
import com.uth.qbca.repository.TaskAssignmentRepository;
import com.uth.qbca.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AssignmentService {
    private static final Logger logger = LoggerFactory.getLogger(AssignmentService.class);
    
    @Autowired
    private TaskAssignmentRepository taskAssignmentRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private NotificationService notificationService;

    // Lấy tất cả assignments với thông tin subject
    public List<TaskAssignment> getAllAssignments() {
        try {
            return taskAssignmentRepository.findAllSimple();
        } catch (Exception e) {
            logger.error("Error getting assignments, fallback to standard findAll: ", e);
            return taskAssignmentRepository.findAll();
        }
    }

    // Lấy assignment theo ID
    public Optional<TaskAssignment> getAssignmentById(Long id) {
        return taskAssignmentRepository.findById(id);
    }

    // Lấy assignments theo user ID
    public List<TaskAssignment> getAssignmentsByUserId(Long userId) {
        List<TaskAssignment> assignments = taskAssignmentRepository.findByUserId(userId);
        
        // Xử lý null safety và validate dữ liệu
        return assignments.stream()
            .filter(assignment -> assignment != null)
            .filter(assignment -> assignment.getTaskName() != null && !assignment.getTaskName().trim().isEmpty())
            .map(assignment -> {
                // Đảm bảo các trường cần thiết không null
                if (assignment.getDescription() == null) {
                    assignment.setDescription("");
                }
                if (assignment.getCompleted() == null) {
                    assignment.setCompleted(false);
                }
                return assignment;
            })
            .collect(Collectors.toList());
    }
    
    // Lấy assignments theo user code (string)
    public List<TaskAssignment> getAssignmentsByUserCode(String userCode) {
        List<TaskAssignment> assignments = taskAssignmentRepository.findByUserCode(userCode);
        
        // Xử lý null safety và validate dữ liệu
        return assignments.stream()
            .filter(assignment -> assignment != null)
            .filter(assignment -> assignment.getTaskName() != null && !assignment.getTaskName().trim().isEmpty())
            .map(assignment -> {
                // Đảm bảo các trường cần thiết không null
                if (assignment.getDescription() == null) {
                    assignment.setDescription("");
                }
                if (assignment.getCompleted() == null) {
                    assignment.setCompleted(false);
                }
                return assignment;
            })
            .collect(Collectors.toList());
    }

    // Lấy assignments theo subject ID
    public List<TaskAssignment> getAssignmentsBySubjectId(Long subjectId) {
        return taskAssignmentRepository.findBySubjectId(subjectId);
    }

    // Lấy assignments theo user và subject
    public List<TaskAssignment> getAssignmentsByUserAndSubject(Long userId, Long subjectId) {
        return taskAssignmentRepository.findByUserIdAndSubjectId(userId, subjectId);
    }

    // Lấy assignments theo trạng thái hoàn thành
    public List<TaskAssignment> getAssignmentsByCompleted(Boolean completed) {
        return taskAssignmentRepository.findByCompleted(completed);
    }

    // Lấy assignments sắp đến deadline (trong vòng N ngày)
    public List<TaskAssignment> getUpcomingAssignments(int days) {
        LocalDate deadline = LocalDate.now().plusDays(days);
        return taskAssignmentRepository.findUpcomingTasks(deadline);
    }

    // Lấy assignments quá hạn
    public List<TaskAssignment> getOverdueAssignments() {
        return taskAssignmentRepository.findOverdueTasks(LocalDate.now());
    }

    // Lấy assignments theo khoảng thời gian deadline
    public List<TaskAssignment> getAssignmentsByDeadlineRange(LocalDate startDate, LocalDate endDate) {
        return taskAssignmentRepository.findByDeadlineBetween(startDate, endDate);
    }

    // Tìm kiếm assignments theo tên task
    public List<TaskAssignment> searchAssignmentsByTaskName(String taskName) {
        return taskAssignmentRepository.findByTaskNameIgnoreCase(taskName);
    }

    // Lấy thống kê assignments theo user
    public AssignmentStats getAssignmentStatsByUserId(Long userId) {
        long totalCount = taskAssignmentRepository.countByUserId(userId);
        long completedCount = taskAssignmentRepository.countCompletedByUserId(userId);
        long pendingCount = totalCount - completedCount;
        
        return new AssignmentStats(totalCount, completedCount, pendingCount);
    }

    // Lấy thống kê assignments theo subject
    public long getAssignmentCountBySubjectId(Long subjectId) {
        return taskAssignmentRepository.countBySubjectId(subjectId);
    }

    // Lưu assignment
    public TaskAssignment saveAssignment(TaskAssignment assignment) {
        try {
            // Xử lý subject
            if (assignment.getSubject() != null && assignment.getSubject().getId() != null) {
                Optional<Subject> existingSubject = subjectRepository.findById(assignment.getSubject().getId());
                if (existingSubject.isPresent()) {
                    assignment.setSubject(existingSubject.get());
                    logger.info("Found subject: {}", existingSubject.get().getName());
                } else {
                    logger.error("Subject not found with id: {}", assignment.getSubject().getId());
                    throw new RuntimeException("Subject not found with id: " + assignment.getSubject().getId());
                }
            }
            
            // Log assignment info before saving
            logger.info("Saving assignment - TaskName: {}, UserId: {}, SubjectId: {}, StartDate: {}, Deadline: {}, Completed: {}", 
                assignment.getTaskName(), assignment.getUserId(), 
                assignment.getSubject() != null ? assignment.getSubject().getId() : null,
                assignment.getStartDate(), assignment.getDeadline(), assignment.getCompleted());
            
            TaskAssignment savedAssignment = taskAssignmentRepository.save(assignment);
            logger.info("Assignment saved successfully with id: {}", savedAssignment.getId());
            
            // Kiểm tra xem đây có phải là assignment mới không (không có ID)
            boolean isNewAssignment = assignment.getId() == null;
            
            // Tạo thông báo cho assignment mới
            if (isNewAssignment && savedAssignment.getUserId() != null) {
                logger.info("Creating notification for new assignment - user: {} with task: {}", 
                           savedAssignment.getUserId(), savedAssignment.getTaskName());
                
                notificationService.notifyTaskAssigned(
                    savedAssignment.getUserId(),
                    savedAssignment.getTaskName(),
                    savedAssignment.getDeadline() != null ? savedAssignment.getDeadline().toString() : "Chưa xác định"
                );
                
                logger.info("Notification created successfully for user: {}", savedAssignment.getUserId());
            }
            
            return savedAssignment;
        } catch (Exception e) {
            logger.error("Error saving assignment: ", e);
            throw e;
        }
    }

    // Tạo assignment mới với thông báo
    public TaskAssignment createAssignment(TaskAssignment assignment) {
        TaskAssignment savedAssignment = taskAssignmentRepository.save(assignment);
        
        // Tạo thông báo cho người được giao nhiệm vụ
        if (savedAssignment.getUserId() != null) {
            logger.info("Creating notification for user: {} with task: {}", 
                       savedAssignment.getUserId(), savedAssignment.getTaskName());
            
            notificationService.notifyTaskAssigned(
                savedAssignment.getUserId(),
                savedAssignment.getTaskName(),
                savedAssignment.getDeadline() != null ? savedAssignment.getDeadline().toString() : "Chưa xác định"
            );
            
            logger.info("Notification created successfully for user: {}", savedAssignment.getUserId());
        } else {
            logger.warn("No userId found for assignment: {}", savedAssignment.getId());
        }
        
        return savedAssignment;
    }

    // Cập nhật trạng thái hoàn thành
    public TaskAssignment updateAssignmentStatus(Long id, Boolean completed) {
        Optional<TaskAssignment> optionalAssignment = taskAssignmentRepository.findById(id);
        if (optionalAssignment.isPresent()) {
            TaskAssignment assignment = optionalAssignment.get();
            assignment.setCompleted(completed);
            return taskAssignmentRepository.save(assignment);
        }
        throw new RuntimeException("Assignment not found with id: " + id);
    }

    // Cập nhật trạng thái hoàn thành với thông báo
    public TaskAssignment updateAssignmentStatus(Long id, boolean completed) {
        TaskAssignment assignment = taskAssignmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Assignment not found with ID: " + id));
            
        boolean wasCompleted = assignment.getCompleted() != null ? assignment.getCompleted() : false;
        assignment.setCompleted(completed);
        TaskAssignment savedAssignment = taskAssignmentRepository.save(assignment);
        
        // Tạo thông báo khi hoàn thành nhiệm vụ
        if (!wasCompleted && completed && savedAssignment.getUserId() != null) {
            notificationService.notifyTaskCompleted(
                savedAssignment.getUserId(),
                savedAssignment.getTaskName()
            );
        }
        
        return savedAssignment;
    }

    // Xóa assignment
    public void deleteAssignment(Long id) {
        taskAssignmentRepository.deleteById(id);
    }

    // Kiểm tra và gửi thông báo cho nhiệm vụ sắp đến hạn
    public void checkAndNotifyUpcomingTasks() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<TaskAssignment> upcomingTasks = taskAssignmentRepository.findUpcomingTasks(tomorrow);
        
        for (TaskAssignment task : upcomingTasks) {
            if (task.getUserId() != null && (task.getCompleted() == null || !task.getCompleted())) {
                notificationService.notifyTaskDueSoon(
                    task.getUserId(),
                    task.getTaskName(),
                    task.getDeadline() != null ? task.getDeadline().toString() : "Chưa xác định"
                );
            }
        }
    }

    // Kiểm tra và gửi thông báo cho nhiệm vụ quá hạn
    public void checkAndNotifyOverdueTasks() {
        List<TaskAssignment> overdueTasks = getOverdueAssignments();
        
        for (TaskAssignment task : overdueTasks) {
            if (task.getUserId() != null) {
                notificationService.notifyTaskOverdue(
                    task.getUserId(),
                    task.getTaskName(),
                    task.getDeadline() != null ? task.getDeadline().toString() : "Chưa xác định"
                );
            }
        }
    }

    // Thông báo khi nhiệm vụ được duyệt
    public void notifyTaskApproved(Long assignmentId) {
        TaskAssignment assignment = taskAssignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found with ID: " + assignmentId));
            
        if (assignment.getUserId() != null) {
            notificationService.notifyTaskApproved(
                assignment.getUserId(),
                assignment.getTaskName()
            );
        }
    }

    // Thông báo khi nhiệm vụ bị từ chối
    public void notifyTaskRejected(Long assignmentId, String reason) {
        TaskAssignment assignment = taskAssignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found with ID: " + assignmentId));
            
        if (assignment.getUserId() != null) {
            notificationService.notifyTaskRejected(
                assignment.getUserId(),
                assignment.getTaskName(),
                reason
            );
        }
    }

    // Inner class cho thống kê
    public static class AssignmentStats {
        private long totalCount;
        private long completedCount;
        private long pendingCount;

        public AssignmentStats(long totalCount, long completedCount, long pendingCount) {
            this.totalCount = totalCount;
            this.completedCount = completedCount;
            this.pendingCount = pendingCount;
        }

        // Getters
        public long getTotalCount() { return totalCount; }
        public long getCompletedCount() { return completedCount; }
        public long getPendingCount() { return pendingCount; }
        public double getCompletionRate() { 
            return totalCount > 0 ? (double) completedCount / totalCount * 100 : 0; 
        }
    }
}
