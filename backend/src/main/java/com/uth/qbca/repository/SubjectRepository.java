package com.uth.qbca.repository;

import com.uth.qbca.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    
    @Query("SELECT s FROM Subject s WHERE s.name = :name")
    Optional<Subject> findByName(@Param("name") String name);
    
    @Query("SELECT s FROM Subject s WHERE s.isActive = true")
    List<Subject> findAllActive();
    
    @Query("SELECT s FROM Subject s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Subject> search(@Param("keyword") String keyword);
    
    boolean existsByName(String name);
    
    @Query("SELECT COUNT(s) FROM Subject s WHERE s.isActive = true")
    long countActive();
}

