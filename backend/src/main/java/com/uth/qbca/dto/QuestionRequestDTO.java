package com.uth.qbca.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequestDTO {

    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    @Size(min = 10, max = 1000, message = "Nội dung câu hỏi phải từ 10 đến 1000 ký tự")
    private String content;

    @NotBlank(message = "Loại câu hỏi không được để trống")
    private String questionType;

    @NotBlank(message = "Độ khó không được để trống")
    private String difficulty;

    private String createdBy;

    // Optional - nếu dùng AI check trùng lặp
    private String embedding;
}
