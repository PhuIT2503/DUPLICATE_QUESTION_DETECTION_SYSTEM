package com.uth.qbca.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatisticDTO {
    private long totalExams;
    private long totalQuestions;
    private long easyQuestions;
    private long mediumQuestions;
    private long hardQuestions;
    private double easyPercent;
    private double mediumPercent;
    private double hardPercent;
}
