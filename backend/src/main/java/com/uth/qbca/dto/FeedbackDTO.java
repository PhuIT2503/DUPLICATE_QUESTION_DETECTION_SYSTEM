package com.uth.qbca.dto;

public class FeedbackDTO {
    private String content;
    private Long createdBy;
    private Long examSubmissionId;

    public FeedbackDTO() {
    }

    public FeedbackDTO(String content, Long createdBy, Long examSubmissionId) {
        this.content = content;
        this.createdBy = createdBy;
        this.examSubmissionId = examSubmissionId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getExamSubmissionId() {
        return examSubmissionId;
    }

    public void setExamSubmissionId(Long examSubmissionId) {
        this.examSubmissionId = examSubmissionId;
    }
}
