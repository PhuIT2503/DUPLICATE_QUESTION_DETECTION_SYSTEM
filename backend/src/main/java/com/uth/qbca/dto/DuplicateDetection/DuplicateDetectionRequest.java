package com.uth.qbca.dto.DuplicateDetection;

import lombok.Data;

@Data
public class DuplicateDetectionRequest {
    private String user_id;
    private String question;
    private String difficulty;
    private String question_type;
}
