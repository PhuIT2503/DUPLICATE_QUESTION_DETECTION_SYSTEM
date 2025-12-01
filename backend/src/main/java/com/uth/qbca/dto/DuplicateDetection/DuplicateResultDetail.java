package com.uth.qbca.dto.DuplicateDetection;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DuplicateResultDetail {
    private String matchedQuestion;
    private double similarity;
    // private String createdBy;
}
