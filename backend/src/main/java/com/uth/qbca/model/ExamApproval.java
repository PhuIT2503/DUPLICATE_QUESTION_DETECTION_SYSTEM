package com.uth.qbca.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ExamApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private ExamSubmission submission;

    private Long approvedBy;

    private String status; // APPROVED | REJECTED

    private String comment;

    private LocalDateTime approvedAt = LocalDateTime.now();

    public ExamApproval() {}

    public ExamApproval(ExamSubmission submission, Long approvedBy, String status, String comment) {
        this.submission = submission;
        this.approvedBy = approvedBy;
        this.status = status;
        this.comment = comment;
        this.approvedAt = LocalDateTime.now();
    }

    // Getter & Setter đầy đủ
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ExamSubmission getSubmission() {
        return submission;
    }

    public void setSubmission(ExamSubmission submission) {
        this.submission = submission;
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

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }
}
