package com.uth.qbca.dto;

public class AssignmentRequestDTO {
    private Long subjectId;
    private Long cloId;
    private Long difficultyId;
    private int quantity;
    private Long assigneeId;

    public AssignmentRequestDTO() {}

    public AssignmentRequestDTO(Long subjectId, Long cloId, Long difficultyId, int quantity, Long assigneeId) {
        this.subjectId = subjectId;
        this.cloId = cloId;
        this.difficultyId = difficultyId;
        this.quantity = quantity;
        this.assigneeId = assigneeId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public Long getCloId() {
        return cloId;
    }

    public void setCloId(Long cloId) {
        this.cloId = cloId;
    }

    public Long getDifficultyId() {
        return difficultyId;
    }

    public void setDifficultyId(Long difficultyId) {
        this.difficultyId = difficultyId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }
}
