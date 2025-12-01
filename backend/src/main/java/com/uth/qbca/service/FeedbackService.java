package com.uth.qbca.service;

import com.uth.qbca.model.Feedback;
import com.uth.qbca.dto.FeedbackDTO;
import com.uth.qbca.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback createFeedback(FeedbackDTO dto) {
        Feedback feedback = new Feedback(
            dto.getContent(),
            dto.getCreatedBy(),
            dto.getExamSubmissionId()
        );
    return feedbackRepository.save(feedback);
}


    public List<Feedback> getFeedbacksByExamSubmission(Long submissionId) {
        return feedbackRepository.findByExamSubmissionId(submissionId);
    }
}
