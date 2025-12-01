package com.uth.qbca.repository;

import com.uth.qbca.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByExamSubmissionId(Long examSubmissionId);
}
