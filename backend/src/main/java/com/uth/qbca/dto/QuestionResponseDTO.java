package com.uth.qbca.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponseDTO {

    private Long id;
    private String content;
    private String embedding;
    private String createdBy;
    private String difficulty;
    private String questionType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
