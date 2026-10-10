package com.jobportal.dto;

import java.util.ArrayList;
import java.util.List;

public class StudentRecommendationResult {

    private Long studentId;
    private String studentName;
    private List<String> studentSkills = new ArrayList<>();
    private String qualification;
    private String preferredLocation;
    private int currentMatchScore; // Average of top recommendations or top score
    private List<String> recommendedSkills = new ArrayList<>(); // Skills to improve match
    private List<RecommendationResponse> recommendations = new ArrayList<>();

    public StudentRecommendationResult() {
    }

    public StudentRecommendationResult(Long studentId, String studentName, List<String> studentSkills, 
                                       String qualification, String preferredLocation, 
                                       int currentMatchScore, List<String> recommendedSkills, 
                                       List<RecommendationResponse> recommendations) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentSkills = studentSkills;
        this.qualification = qualification;
        this.preferredLocation = preferredLocation;
        this.currentMatchScore = currentMatchScore;
        this.recommendedSkills = recommendedSkills;
        this.recommendations = recommendations;
    }

    // Getters and Setters
    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public List<String> getStudentSkills() {
        return studentSkills;
    }

    public void setStudentSkills(List<String> studentSkills) {
        this.studentSkills = studentSkills;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getPreferredLocation() {
        return preferredLocation;
    }

    public void setPreferredLocation(String preferredLocation) {
        this.preferredLocation = preferredLocation;
    }

    public int getCurrentMatchScore() {
        return currentMatchScore;
    }

    public void setCurrentMatchScore(int currentMatchScore) {
        this.currentMatchScore = currentMatchScore;
    }

    public List<String> getRecommendedSkills() {
        return recommendedSkills;
    }

    public void setRecommendedSkills(List<String> recommendedSkills) {
        this.recommendedSkills = recommendedSkills;
    }

    public List<RecommendationResponse> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<RecommendationResponse> recommendations) {
        this.recommendations = recommendations;
    }
}
