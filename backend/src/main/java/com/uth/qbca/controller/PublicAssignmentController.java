package com.uth.qbca.controller;

import com.uth.qbca.model.TaskAssignment;
import com.uth.qbca.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/public/assignments")
@CrossOrigin(origins = "*")
public class PublicAssignmentController {
    private static final Logger logger = LoggerFactory.getLogger(PublicAssignmentController.class);
    
    @Autowired
    private AssignmentService assignmentService;

    // Test endpoint - không cần authentication
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Public Assignment API is working!");
    }

    // Lấy danh sách assignments (public để test)
    @GetMapping("/list")
    public ResponseEntity<List<TaskAssignment>> getPublicAssignments() {
        try {
            logger.info("Fetching assignments for public test");
            List<TaskAssignment> assignments = assignmentService.getAllAssignments();
            logger.info("Found {} assignments", assignments.size());
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            logger.error("Error fetching public assignments: ", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    // Lấy số lượng assignments
    @GetMapping("/count")
    public ResponseEntity<Long> getAssignmentCount() {
        try {
            List<TaskAssignment> assignments = assignmentService.getAllAssignments();
            return ResponseEntity.ok((long) assignments.size());
        } catch (Exception e) {
            logger.error("Error getting assignment count: ", e);
            return ResponseEntity.status(500).body(0L);
        }
    }
}
