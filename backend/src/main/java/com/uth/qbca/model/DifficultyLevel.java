package com.uth.qbca.model;

import jakarta.persistence.*;

@Entity
@Table(name = "DifficultyLevels")
public class DifficultyLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String levelName; // e.g., Easy, Medium, Hard

    @Column
    private String description;

    // Constructors
    public DifficultyLevel() {}

    public DifficultyLevel(String levelName, String description) {
        this.levelName = levelName;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLevelName() {
        return levelName;
    }

    public void setLevelName(String levelName) {
        this.levelName = levelName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
