package com.uth.qbca.repository;

import com.uth.qbca.model.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DifficultyLevelRepository extends JpaRepository<DifficultyLevel, Long> {
    
    java.util.Optional<DifficultyLevel> findByLevelNameIgnoreCase(String levelName);

    java.util.List<DifficultyLevel> findAllByOrderByLevelNameAsc();
}
