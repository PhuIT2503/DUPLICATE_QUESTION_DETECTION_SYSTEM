package com.uth.qbca.service;

import com.uth.qbca.dto.SubmissionDTO;
import com.uth.qbca.model.ExamSubmission;
import com.uth.qbca.model.User;
import com.uth.qbca.repository.ExamSubmissionRepository;
import com.uth.qbca.repository.UserRepository;
import com.uth.qbca.config.JWTUtils;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubmissionService {

    @Autowired
    private ExamSubmissionRepository submissionRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private HttpServletRequest request;

    public ExamSubmission createSubmission(SubmissionDTO dto) {
        String token = request.getHeader("Authorization").substring(7);
        String userCode = jwtUtils.getUserCodeFromToken(token);

        User user = userRepository.findByUserCode(userCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        ExamSubmission submission = new ExamSubmission();
        submission.setTitle(dto.getTitle());
        submission.setDescription(dto.getDescription());
        submission.setSubjectId(dto.getSubjectId());
        submission.setFileUrl(dto.getFileUrl());
        submission.setCreatedAt(LocalDateTime.now());
        submission.setCreatedBy(user.getId());

        return submissionRepo.save(submission);
    }

    public List<ExamSubmission> getByUser(Long userId) {
        return submissionRepo.findByCreatedBy(userId);
    }

    public List<ExamSubmission> getBySubject(Long subjectId) {
        return submissionRepo.findBySubjectId(subjectId);
    }

    public ExamSubmission getById(Long id) {
        return submissionRepo.findById(id).orElse(null);
    }
}
