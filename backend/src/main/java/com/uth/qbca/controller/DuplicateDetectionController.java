package com.uth.qbca.controller;

import com.uth.qbca.dto.DuplicateDetection.*;
import com.uth.qbca.service.DuplicateDetectionApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/duplicate-detection")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DuplicateDetectionController {

    private final DuplicateDetectionApiService pythonApiService;

    @GetMapping("/ping")
    public String ping() {
        return pythonApiService.callHome();
    }

    @PostMapping("/add-question")
    public DuplicateDetectionResponse addQuestion(@RequestBody DuplicateDetectionRequest request) {
        return pythonApiService.addQuestion(request);
    }

    @PostMapping("/check-duplicate")
    public DuplicateDetectionResponse checkDuplicate(@RequestBody DuplicateDetectionRequest request) {
        return pythonApiService.checkDuplicate(request);
    }

    @PostMapping("/agency-register")
    public DuplicateDetectionResponse registerAgency(@RequestBody DuplicateDetectionRequest request) {
        return pythonApiService.agencyRegister(request);
    }
    @PostMapping("/check-duplicates-from-file")
    public DuplicateDetectionFileResponse checkDuplicatesFromFile(@RequestParam("file") MultipartFile file) {
        return pythonApiService.checkDuplicatesFromFile(file);
    }
}
