package com.uth.qbca.controller;

import com.uth.qbca.dto.QuestionRequestDTO;
import com.uth.qbca.dto.QuestionResponseDTO;
import com.uth.qbca.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    // GET /api/questions
    @GetMapping
    public ResponseEntity<List<QuestionResponseDTO>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    // GET /api/questions/{id}
    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponseDTO> getQuestionById(@PathVariable Long id) {
        return questionService.getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/questions
    @PostMapping
    public ResponseEntity<QuestionResponseDTO> createQuestion(@Valid @RequestBody QuestionRequestDTO request) {
        QuestionResponseDTO created = questionService.createQuestion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /api/questions/{id}
    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponseDTO> updateQuestion(@PathVariable Long id,
                                                              @Valid @RequestBody QuestionRequestDTO request) {
        return questionService.updateQuestion(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/questions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        boolean deleted = questionService.deleteQuestion(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
