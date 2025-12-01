package com.uth.qbca.repository;

import com.uth.qbca.model.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
    
    // Tìm theo subject ID (xử lý trường hợp subject null)
    @Query("SELECT t FROM TaskAssignment t LEFT JOIN t.subject s WHERE s.id = :subjectId ORDER BY t.deadline ASC")
    List<TaskAssignment> findBySubjectId(@Param("subjectId") Long subjectId);

    // Tìm theo user ID
    @Query("SELECT t FROM TaskAssignment t WHERE t.userId = :userId ORDER BY t.deadline ASC")
    List<TaskAssignment> findByUserId(@Param("userId") Long userId);
    
    // Tìm theo user code (string)
    @Query("SELECT t FROM TaskAssignment t JOIN User u ON t.userId = u.id WHERE u.userCode = :userCode ORDER BY t.deadline ASC")
    List<TaskAssignment> findByUserCode(@Param("userCode") String userCode);

    // Tìm theo tên task (không phân biệt chữ hoa/thường)
    @Query("SELECT t FROM TaskAssignment t WHERE LOWER(t.taskName) LIKE LOWER(CONCAT('%', :taskName, '%')) ORDER BY t.deadline ASC")
    List<TaskAssignment> findByTaskNameIgnoreCase(@Param("taskName") String taskName);

    // Tìm theo trạng thái hoàn thành
    @Query("SELECT t FROM TaskAssignment t WHERE t.completed = :completed ORDER BY t.deadline ASC")
    List<TaskAssignment> findByCompleted(@Param("completed") Boolean completed);

    // Tìm theo khoảng thời gian deadline
    @Query("SELECT t FROM TaskAssignment t WHERE t.deadline BETWEEN :startDate AND :endDate ORDER BY t.deadline ASC")
    List<TaskAssignment> findByDeadlineBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Tìm task sắp đến deadline (trong vòng N ngày)
    @Query("SELECT t FROM TaskAssignment t WHERE t.deadline <= :deadline AND t.completed = false ORDER BY t.deadline ASC")
    List<TaskAssignment> findUpcomingTasks(@Param("deadline") LocalDate deadline);

    // Tìm task quá hạn
    @Query("SELECT t FROM TaskAssignment t WHERE t.deadline < :currentDate AND t.completed = false ORDER BY t.deadline ASC")
    List<TaskAssignment> findOverdueTasks(@Param("currentDate") LocalDate currentDate);

    // Đếm số task theo subject
    @Query("SELECT COUNT(t) FROM TaskAssignment t WHERE t.subject.id = :subjectId")
    long countBySubjectId(@Param("subjectId") Long subjectId);

    // Đếm số task theo user
    @Query("SELECT COUNT(t) FROM TaskAssignment t WHERE t.userId = :userId")
    long countByUserId(@Param("userId") Long userId);

    // Đếm số task hoàn thành theo user
    @Query("SELECT COUNT(t) FROM TaskAssignment t WHERE t.userId = :userId AND t.completed = true")
    long countCompletedByUserId(@Param("userId") Long userId);

    // Lấy tất cả assignment với thông tin subject (sử dụng LEFT JOIN để tránh lỗi khi subject null)
    @Query("SELECT t FROM TaskAssignment t LEFT JOIN FETCH t.subject ORDER BY t.deadline ASC NULLS LAST")
    List<TaskAssignment> findAllWithSubject();

    // Tìm theo user và subject
    @Query("SELECT t FROM TaskAssignment t LEFT JOIN t.subject s WHERE t.userId = :userId AND s.id = :subjectId ORDER BY t.deadline ASC")
    List<TaskAssignment> findByUserIdAndSubjectId(@Param("userId") Long userId, @Param("subjectId") Long subjectId);

    // Tìm assignment có subject null
    @Query("SELECT t FROM TaskAssignment t WHERE t.subject IS NULL ORDER BY t.deadline ASC")
    List<TaskAssignment> findBySubjectIsNull();

    // Đếm số task theo subject (bao gồm cả null)
    @Query("SELECT COUNT(t) FROM TaskAssignment t LEFT JOIN t.subject s WHERE s.id = :subjectId OR (s IS NULL AND :subjectId IS NULL)")
    long countBySubjectIdIncludingNull(@Param("subjectId") Long subjectId);

    // Lấy tất cả assignment đơn giản (không JOIN)
    @Query("SELECT t FROM TaskAssignment t ORDER BY t.deadline ASC NULLS LAST")
    List<TaskAssignment> findAllSimple();
}
