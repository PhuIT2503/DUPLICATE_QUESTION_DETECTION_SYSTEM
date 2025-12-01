package com.uth.qbca.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.uth.qbca.model.Notification;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT n FROM Notification n JOIN User u ON n.userId = u.id WHERE u.userCode = :userCode ORDER BY n.createdAt DESC")
    List<Notification> findByUserCodeOrderByCreatedAtDesc(@Param("userCode") String userCode);
}

    

