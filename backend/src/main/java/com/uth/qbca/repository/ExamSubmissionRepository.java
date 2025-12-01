package com.uth.qbca.repository;

import com.uth.qbca.model.ExamSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamSubmissionRepository extends JpaRepository<ExamSubmission, Long> {
    List<ExamSubmission> findBySubjectId(Long subjectId);
    List<ExamSubmission> findByCreatedBy(Long userId);
}
