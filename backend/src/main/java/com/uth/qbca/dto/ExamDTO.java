package com.uth.qbca.dto;

import lombok.Data;
import java.util.List;

@Data
public class ExamDTO {
    private Long id;
    private String name;
    private List<ExamQuestionDTO> questions;
    private double difficultyPercentage;
}
