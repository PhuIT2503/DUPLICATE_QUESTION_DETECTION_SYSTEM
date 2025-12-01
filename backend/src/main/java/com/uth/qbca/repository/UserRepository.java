package com.uth.qbca.repository;

import com.uth.qbca.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u WHERE u.userCode = :userCode")
    Optional<User> findByUserCode(@Param("userCode") String userCode);
    
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);
    
    boolean existsByUserCode(String userCode);
    
    boolean existsByEmail(String email);
}