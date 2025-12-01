package com.uth.qbca.dto;

public class FeedbackRequest {
    private String feedback;
    private Long reviewerId;
    
    public FeedbackRequest() {}
    
    public FeedbackRequest(String feedback, Long reviewerId) {
        this.feedback = feedback;
        this.reviewerId = reviewerId;
    }
    
    public String getFeedback() {
        return feedback;
    }
    
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
    
    public Long getReviewerId() {
        return reviewerId;
    }
    
    public void setReviewerId(Long reviewerId) {
        this.reviewerId = reviewerId;
    }
}
