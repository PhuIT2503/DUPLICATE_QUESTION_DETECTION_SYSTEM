package com.uth.qbca.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class QuestionDTO {

    private Long id;

    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    @Size(min = 10, max = 1000, message = "Nội dung câu hỏi phải từ 10 đến 1000 ký tự")
    private String content;

    private String embedding;

    @NotBlank(message = "Loại câu hỏi không được để trống")
    private String questionType;

    @NotBlank(message = "Mức độ khó không được để trống")
    private String difficulty;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Constructor mặc định
    public QuestionDTO() {}

    // Constructor tiện tạo nhanh
    public QuestionDTO(String content, String questionType, String difficulty) {
        this.content = content;
        this.questionType = questionType;
        this.difficulty = difficulty;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getEmbedding() { return embedding; }
    public void setEmbedding(String embedding) { this.embedding = embedding; }

    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
