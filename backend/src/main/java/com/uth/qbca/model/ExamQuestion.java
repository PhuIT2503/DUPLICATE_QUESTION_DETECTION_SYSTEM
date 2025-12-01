package com.uth.qbca.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "exam_questions")
public class ExamQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") 
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "question_text", columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "difficulty_level")
    private String difficultyLevel;
}
