package com.uth.qbca.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // ✔ cột id
    private Long id;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false) // ✔ cột content
    private String content;

    @Column(name = "Embedding", columnDefinition = "TEXT") // ✔ tên đúng là Embedding (viết hoa E)
    private String embedding;

    @Column(name = "created_by") // ✔ cột created_by
    private String createdBy;

    @Column(name = "created_at") // ✔ cột created_at
    private LocalDateTime createdAt;

    @Column(name = "updated_at") // ✔ cột updated_at
    private LocalDateTime updatedAt;

    @Column(name = "level") // ✔ cột difficulty
    private String level;

    @Column(name = "question_type") // ✔ cột question_type
    private String questionType;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

