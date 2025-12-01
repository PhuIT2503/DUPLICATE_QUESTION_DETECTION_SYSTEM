package com.uth.qbca.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import java.time.LocalDateTime;

@Entity
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(name="created_at", nullable = false)
    private LocalDateTime createdAt;

    private Long createdBy;

    private Long examSubmissionId;

    public Feedback() {
    }

    public Feedback(String content, Long createdBy, Long examSubmissionId) {
        this.content = content;
        this.createdBy = createdBy;
        this.examSubmissionId = examSubmissionId;
        this.createdAt = LocalDateTime.now(); 
    }


    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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
