package com.uth.qbca.dto;

import lombok.Data;

@Data
public class ExamQuestionDTO {
    private Long id; // ID của câu hỏi trong đề thi
    private String questionText; // Nội dung câu hỏi
    private String difficultyLevel; // Độ khó (EASY, MEDIUM, HARD)
}
