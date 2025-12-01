package com.uth.qbca.service;

import com.uth.qbca.dto.SubjectDTO;
import com.uth.qbca.model.Subject;
import com.uth.qbca.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    // Create new subject
    public SubjectDTO createSubject(String name, String description) {
        if (subjectRepository.existsByName(name)) {
            throw new RuntimeException("Subject with this name already exists");
        }

        Subject subject = new Subject(name, description);
        Subject savedSubject = subjectRepository.save(subject);
        return convertToDTO(savedSubject);
    }

    // Get all subjects
    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get all active subjects
    public List<SubjectDTO> getAllActiveSubjects() {
        return subjectRepository.findAllActive().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get subject by ID
    public Optional<SubjectDTO> getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .map(this::convertToDTO);
    }

    // Update subject
    public SubjectDTO updateSubject(Long id, String name, String description) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if (name != null && !name.equals(subject.getName())) {
            if (subjectRepository.existsByName(name)) {
                throw new RuntimeException("Subject with this name already exists");
            }
            subject.setName(name);
        }

        if (description != null) {
            subject.setDescription(description);
        }

        subject.setUpdatedAt(LocalDateTime.now());
        Subject updatedSubject = subjectRepository.save(subject);
        return convertToDTO(updatedSubject);
    }

    // Activate/Deactivate subject
    public SubjectDTO setSubjectStatus(Long id, boolean isActive) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        subject.setActive(isActive);
        subject.setUpdatedAt(LocalDateTime.now());
        Subject updatedSubject = subjectRepository.save(subject);
        return convertToDTO(updatedSubject);
    }

    // Search subjects
    public List<SubjectDTO> searchSubjects(String keyword) {
        return subjectRepository.search(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get count of active subjects
    public long getActiveSubjectsCount() {
        return subjectRepository.countActive();
    }

    // Helper method to convert Subject to SubjectDTO
    private SubjectDTO convertToDTO(Subject subject) {
        return new SubjectDTO(
            subject.getId(),
            subject.getName(),
            subject.getDescription(),
            subject.isActive(),
            subject.getCreatedAt(),
            subject.getUpdatedAt()
        );
    }

    // Delete subject
    public boolean deleteSubject(Long id) {
        if (subjectRepository.existsById(id)) {
            subjectRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
