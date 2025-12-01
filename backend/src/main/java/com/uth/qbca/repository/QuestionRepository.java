package com.uth.qbca.repository;

import com.uth.qbca.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByLevelIgnoreCase(String level);

    List<Question> findAll();

    @Query("SELECT COUNT(q) FROM Question q WHERE LOWER(q.level) = LOWER(:level)")
    long countByLevelIgnoreCase(@Param("level") String level);

    List<Question> findByQuestionTypeIgnoreCase(String questionType);

    @Query("SELECT q FROM Question q WHERE LOWER(q.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Question> searchByContent(@Param("keyword") String keyword);

    List<Question> findByCreatedBy(String createdBy);
}
