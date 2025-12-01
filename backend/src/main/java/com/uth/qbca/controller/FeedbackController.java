package com.uth.qbca.controller;

import com.uth.qbca.dto.FeedbackDTO;
import com.uth.qbca.model.Feedback;
import com.uth.qbca.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;


import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin("*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public Feedback create(@RequestBody FeedbackDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("===> Logged-in user: " + auth.getName());
        System.out.println("===> Authorities: " + auth.getAuthorities());
        return feedbackService.createFeedback(dto);
    }

    @GetMapping("/exam-submission/{id}")
    public List<Feedback> getByExamSubmission(@PathVariable Long id) {
        return feedbackService.getFeedbacksByExamSubmission(id);
    }
}
