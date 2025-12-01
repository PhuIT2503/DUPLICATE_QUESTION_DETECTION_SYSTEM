package com.uth.qbca.dto.DuplicateDetection;

import java.util.List;
import lombok.Data;


@Data
public class DuplicateFromFileResult {
    private String question;      // Câu hỏi từ file
    private String status;        // "duplicate" hoặc "unique"
    private List<DuplicateResultDetail> duplicates; // nếu có
}

