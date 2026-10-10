package com.jobportal.repository;

import com.jobportal.entity.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findAllByOrderByPostedDateDesc();

    @Query("SELECT i FROM Internship i WHERE " +
           "(:keyword IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.company) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.skills) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(i.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:internshipType IS NULL OR LOWER(i.internshipType) = LOWER(:internshipType))")
    List<Internship> searchInternships(@Param("keyword") String keyword, @Param("location") String location, @Param("internshipType") String internshipType);
}
