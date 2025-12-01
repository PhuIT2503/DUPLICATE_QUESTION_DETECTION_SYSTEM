package com.uth.qbca.controller;

import com.uth.qbca.dto.ApprovalRequestDTO;
import com.uth.qbca.model.ExamApproval;
import com.uth.qbca.service.ApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/approvals")
@CrossOrigin(origins = "*")
public class ExamApprovalController {

    @Autowired
    private ApprovalService approvalService;

    @PostMapping
    public ResponseEntity<ExamApproval> handleApproval(@RequestBody ApprovalRequestDTO dto) {
        ExamApproval result = approvalService.approve(dto);
        if (result == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(result);
    }
}
