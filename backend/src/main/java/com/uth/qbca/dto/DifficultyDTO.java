package com.uth.qbca.dto;

public class DifficultyDTO {
    private Long id;
    private String level;
    private String description;

    public DifficultyDTO() {}

    public DifficultyDTO(Long id, String level, String description) {
        this.id = id;
        this.level = level;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
