package com.uth.qbca.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "exam_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "subject_id", nullable = false)
    private Long subjectId;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "file_url")
    private String fileUrl;

    @Builder.Default
    @Column(name = "status", nullable = false)
    private String status = "PENDING"; // PENDING / APPROVED / REJECTED

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
