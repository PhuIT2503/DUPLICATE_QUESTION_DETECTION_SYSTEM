package com.uth.qbca.dto;

public class AssignmentResponseDTO {
    private Long assignmentId;
    private String subjectName;
    private String cloName;
    private String difficultyLevel;
    private int quantity;
    private String assigneeName;
    private String status;

    public AssignmentResponseDTO() {}

    public AssignmentResponseDTO(Long assignmentId, String subjectName, String cloName, String difficultyLevel, int quantity, String assigneeName, String status) {
        this.assignmentId = assignmentId;
        this.subjectName = subjectName;
        this.cloName = cloName;
        this.difficultyLevel = difficultyLevel;
        this.quantity = quantity;
        this.assigneeName = assigneeName;
        this.status = status;
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getCloName() {
        return cloName;
    }

    public void setCloName(String cloName) {
        this.cloName = cloName;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getAssigneeName() {
        return assigneeName;
    }

    public void setAssigneeName(String assigneeName) {
        this.assigneeName = assigneeName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
