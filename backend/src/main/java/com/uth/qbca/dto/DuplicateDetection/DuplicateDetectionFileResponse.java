package com.uth.qbca.dto.DuplicateDetection;

import lombok.Data;
import java.util.List;

@Data
public class DuplicateDetectionFileResponse {
    private List<DuplicateFromFileResult> results;
}

