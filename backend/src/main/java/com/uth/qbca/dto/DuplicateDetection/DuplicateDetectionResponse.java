package com.uth.qbca.dto.DuplicateDetection;

import lombok.Data;

@Data
public class DuplicateDetectionResponse {
    private String status;
    private String message;
    private Object data;
}