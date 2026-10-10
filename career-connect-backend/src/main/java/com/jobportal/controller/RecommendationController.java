package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.StudentRecommendationResult;
import com.jobportal.service.AIRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final AIRecommendationService recommendationService;

    @Autowired
    public RecommendationController(AIRecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    /**
     * GET /api/recommendations/student/{studentId}
     * Returns AI-analyzed, skill-matched jobs and internships for a registered student.
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<StudentRecommendationResult>> getRecommendationsForStudent(
            @PathVariable Long studentId) {
        StudentRecommendationResult result = recommendationService.getRecommendationsForStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("AI recommendations generated successfully", result));
    }

    /**
     * GET /api/recommendations/guest
     * Allows guest users (e.g., on the Home page) to preview recommendations.
     */
    @GetMapping("/guest")
    public ResponseEntity<ApiResponse<StudentRecommendationResult>> getGuestRecommendations(
            @RequestParam(required = false, defaultValue = "Java, Spring Boot, React, MySQL") String skills,
            @RequestParam(required = false, defaultValue = "B.Tech Computer Science") String qualification,
            @RequestParam(required = false, defaultValue = "Bangalore, India") String location,
            @RequestParam(required = false, defaultValue = "Software Development") String interests) {
        StudentRecommendationResult result = recommendationService.getGuestRecommendations(
                skills, qualification, location, interests
        );
        return ResponseEntity.ok(ApiResponse.success("AI guest recommendations generated successfully", result));
    }
}
