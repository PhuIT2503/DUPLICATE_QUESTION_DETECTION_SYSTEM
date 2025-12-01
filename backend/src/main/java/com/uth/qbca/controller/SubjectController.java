package com.uth.qbca.controller;

import com.uth.qbca.dto.SubjectDTO;
import com.uth.qbca.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*") 
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    // Create new subject
    @PostMapping
    public ResponseEntity<SubjectDTO> createSubject(@RequestParam String name,
                                                    @RequestParam(required = false) String description) {
        SubjectDTO created = subjectService.createSubject(name, description);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Get all subjects
    @GetMapping
    public ResponseEntity<List<SubjectDTO>> getAllSubjects() {
        List<SubjectDTO> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(subjects);
    }

    // Get all active subjects
    @GetMapping("/active")
    public ResponseEntity<List<SubjectDTO>> getAllActiveSubjects() {
        List<SubjectDTO> subjects = subjectService.getAllActiveSubjects();
        return ResponseEntity.ok(subjects);
    }

    // Get subject by ID
    @GetMapping("/{id}")
    public ResponseEntity<SubjectDTO> getSubjectById(@PathVariable Long id) {
        Optional<SubjectDTO> subject = subjectService.getSubjectById(id);
        return subject.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update subject
    @PutMapping("/{id}")
    public ResponseEntity<SubjectDTO> updateSubject(@PathVariable Long id,
                                                    @RequestParam(required = false) String name,
                                                    @RequestParam(required = false) String description) {
        SubjectDTO updated = subjectService.updateSubject(id, name, description);
        return ResponseEntity.ok(updated);
    }

    // Activate/Deactivate subject
    @PatchMapping("/{id}/status")
    public ResponseEntity<SubjectDTO> setSubjectStatus(@PathVariable Long id,
                                                       @RequestParam boolean isActive) {
        SubjectDTO updated = subjectService.setSubjectStatus(id, isActive);
        return ResponseEntity.ok(updated);
    }

    // Search subjects
    @GetMapping("/search")
    public ResponseEntity<List<SubjectDTO>> searchSubjects(@RequestParam String keyword) {
        List<SubjectDTO> subjects = subjectService.searchSubjects(keyword);
        return ResponseEntity.ok(subjects);
    }

    // Get count of active subjects
    @GetMapping("/active/count")
    public ResponseEntity<Long> getActiveSubjectsCount() {
        long count = subjectService.getActiveSubjectsCount();
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        boolean deleted = subjectService.deleteSubject(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 nếu không tìm thấy
        }
    }
}
