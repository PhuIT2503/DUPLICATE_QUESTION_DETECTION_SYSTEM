// package com.uth.qbca.repository;

// import com.uth.qbca.model.Exam;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.CrudRepository;

// public interface ReportRepository extends CrudRepository<Exam, Long> {
//     @Query("SELECT COUNT(e) FROM Exam e")
//     int countAllExams();

//     @Query("SELECT AVG(e.difficultyPercentage) FROM Exam e")
//     double averageDifficulty();

//     @Query("SELECT COUNT(q) FROM ExamQuestion q")
//     long countAllQuestions();

//     @Query("SELECT COUNT(q) FROM ExamQuestion q WHERE q.difficultyLevel = 'EASY'")
//     long countEasyQuestions();

//     @Query("SELECT COUNT(q) FROM ExamQuestion q WHERE q.difficultyLevel = 'MEDIUM'")
//     long countMediumQuestions();

//     @Query("SELECT COUNT(q) FROM ExamQuestion q WHERE q.difficultyLevel = 'HARD'")
//     long countHardQuestions();
// }