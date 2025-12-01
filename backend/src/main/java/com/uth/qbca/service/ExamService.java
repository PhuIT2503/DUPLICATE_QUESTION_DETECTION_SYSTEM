package com.uth.qbca.service;

import com.uth.qbca.dto.ExamDTO;
import com.uth.qbca.dto.ExamRequestDTO;
import com.uth.qbca.dto.ExamQuestionDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

// Interface
public interface ExamService {
    ExamDTO generateExam(ExamRequestDTO request);
}

// Implementation
@Service
class ExamServiceImpl implements ExamService {

    @Override
    public ExamDTO generateExam(ExamRequestDTO request) {
        ExamDTO dto = new ExamDTO();
        dto.setName("Generated Exam for level: " + request.getLevel());
        dto.setDifficultyPercentage(0.7); // Hardcoded ví dụ

        List<ExamQuestionDTO> questionList = new ArrayList<>();
        for (int i = 1; i <= request.getNumQuestions(); i++) {
            ExamQuestionDTO q = new ExamQuestionDTO();
            q.setId((long) i);
            q.setQuestionText("Sample question " + i);
            q.setDifficultyLevel(request.getLevel().toUpperCase());
            questionList.add(q);
        }

        dto.setQuestions(questionList);
        return dto;
    }
}
