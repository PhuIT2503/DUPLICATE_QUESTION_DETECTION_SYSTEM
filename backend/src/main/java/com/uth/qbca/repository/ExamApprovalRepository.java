package com.uth.qbca.repository;

import com.uth.qbca.model.ExamApproval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamApprovalRepository extends JpaRepository<ExamApproval, Long> {
    List<ExamApproval> findBySubmissionId(Long submissionId);
}
