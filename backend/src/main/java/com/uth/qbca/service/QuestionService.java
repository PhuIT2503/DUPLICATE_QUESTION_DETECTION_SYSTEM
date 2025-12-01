package com.uth.qbca.service;

import com.uth.qbca.dto.QuestionRequestDTO;
import com.uth.qbca.dto.QuestionResponseDTO;
import com.uth.qbca.model.Question;
import com.uth.qbca.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    // Lấy tất cả câu hỏi
    public List<QuestionResponseDTO> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Lấy theo ID
    public Optional<QuestionResponseDTO> getQuestionById(Long id) {
        return questionRepository.findById(id).map(this::toDTO);
    }

    // Thêm câu hỏi mới
    public QuestionResponseDTO createQuestion(QuestionRequestDTO dto) {
        Question question = toEntity(dto);
        Question saved = questionRepository.save(question);
        return toDTO(saved);
    }

    // Cập nhật câu hỏi
    public Optional<QuestionResponseDTO> updateQuestion(Long id, QuestionRequestDTO dto) {
        return questionRepository.findById(id).map(existing -> {
            existing.setContent(dto.getContent());
            existing.setLevel(dto.getDifficulty()); // mapping từ DTO.difficulty → entity.level
            existing.setQuestionType(dto.getQuestionType());
            existing.setCreatedBy(dto.getCreatedBy());
            return toDTO(questionRepository.save(existing));
        });
    }

    // Xoá câu hỏi
    public boolean deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) return false;
        questionRepository.deleteById(id);
        return true;
    }

    // ======= Mapping =======

    private QuestionResponseDTO toDTO(Question entity) {
        return QuestionResponseDTO.builder()
                .id(entity.getId())
                .content(entity.getContent())
                .embedding(entity.getEmbedding())
                .createdBy(entity.getCreatedBy())
                .difficulty(entity.getLevel()) // mapping từ entity.level → DTO.difficulty
                .questionType(entity.getQuestionType())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private Question toEntity(QuestionRequestDTO dto) {
        return Question.builder()
                .content(dto.getContent())
                .embedding(null) // để trống, nếu sau này tích hợp AI sẽ update
                .createdBy(dto.getCreatedBy())
                .level(dto.getDifficulty()) // mapping từ DTO → entity
                .questionType(dto.getQuestionType())
                .build();
    }
}
