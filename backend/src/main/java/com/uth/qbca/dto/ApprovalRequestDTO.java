package com.uth.qbca.dto;

public class ApprovalRequestDTO {
    private Long submissionId;
    private Long approvedBy;
    private String status; // APPROVED | REJECTED
    private String comment;

    public ApprovalRequestDTO() {}
    public ApprovalRequestDTO(Long submissionId, Long approvedBy, String status, String comment) {
        this.submissionId = submissionId;
        this.approvedBy = approvedBy;
        this.status = status;
        this.comment = comment;
    }
    public Long getSubmissionId() {
        return submissionId;
    }   
    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }
    public Long getApprovedBy() {
        return approvedBy;
    }
    public void setApprovedBy(Long approvedBy) {
        this.approvedBy = approvedBy;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getComment() {
        return comment;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }
}
