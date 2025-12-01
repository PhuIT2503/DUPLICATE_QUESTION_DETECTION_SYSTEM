package com.uth.qbca.repository;

import com.uth.qbca.model.CLO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CLORepository extends JpaRepository<CLO, Long> {
    // Tìm tất cả CLO theo subjectId
    java.util.List<CLO> findBySubjectId(Long subjectId);

    // Tìm CLO theo tên (không phân biệt hoa thường)
    java.util.List<CLO> findByNameIgnoreCase(String name);

    // Đếm số CLO theo subjectId
    long countBySubjectId(Long subjectId);
}
