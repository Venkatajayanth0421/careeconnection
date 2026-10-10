package com.jobportal.repository;

import com.jobportal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentIdOrderByApplicationDateDesc(Long studentId);
    List<Application> findByJobIdOrderByApplicationDateDesc(Long jobId);
    List<Application> findByInternshipIdOrderByApplicationDateDesc(Long internshipId);
    List<Application> findAllByOrderByApplicationDateDesc();
    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);
    boolean existsByStudentIdAndInternshipId(Long studentId, Long internshipId);
}
