package com.uth.qbca.repository;

import com.uth.qbca.model.TaskSubmission;
import com.uth.qbca.model.TaskSubmission.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, Long> {
    
    /**
     * Tìm tất cả submissions của một assignment
     */
    List<TaskSubmission> findByAssignmentIdOrderBySubmittedAtDesc(Long assignmentId);
    
    /**
     * Tìm submissions theo status của một assignment
     */
    List<TaskSubmission> findByAssignmentIdAndStatusOrderBySubmittedAtDesc(Long assignmentId, SubmissionStatus status);
    
    /**
     * Tìm tất cả submissions của user (thông qua assignment)
     */
    @Query("SELECT ts FROM TaskSubmission ts WHERE ts.assignment.userId = :userId ORDER BY ts.submittedAt DESC")
    List<TaskSubmission> findByUserIdOrderBySubmittedAtDesc(@Param("userId") Long userId);
    
    /**
     * Tìm submissions theo status của user
     */
    @Query("SELECT ts FROM TaskSubmission ts WHERE ts.assignment.userId = :userId AND ts.status = :status ORDER BY ts.submittedAt DESC")
    List<TaskSubmission> findByUserIdAndStatusOrderBySubmittedAtDesc(@Param("userId") Long userId, @Param("status") SubmissionStatus status);
    
    /**
     * Đếm số submissions theo status của một assignment
     */
    int countByAssignmentIdAndStatus(Long assignmentId, SubmissionStatus status);
    
    /**
     * Tìm submissions cần review (cho người giao nhiệm vụ)
     */
    @Query("SELECT ts FROM TaskSubmission ts WHERE ts.assignment.assignedBy = :assignerId AND ts.status = 'PENDING' ORDER BY ts.submittedAt ASC")
    List<TaskSubmission> findPendingSubmissionsByAssigner(@Param("assignerId") Long assignerId);
    
    /**
     * Kiểm tra user có file đang pending không
     */
    @Query("SELECT COUNT(ts) > 0 FROM TaskSubmission ts WHERE ts.assignment.userId = :userId AND ts.status = 'PENDING'")
    boolean hasPendingSubmissions(@Param("userId") Long userId);
}
