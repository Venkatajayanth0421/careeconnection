package com.jobportal.dto;

import java.util.ArrayList;
import java.util.List;

public class RecommendationResponse {

    private Long id;
    private Long opportunityId;
    private String title;
    private String company;
    private String type; // "Job" or "Internship"
    private String location;
    private int matchScore; // 0 - 100
    private List<String> matchedSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();
    private List<String> requiredSkills = new ArrayList<>();
    private String reason;
    private String salaryOrStipend;
    private String opportunityType; // Full-time, Hybrid, Remote, etc.
    private String duration; // For internships
    private String description;

    public RecommendationResponse() {
    }

    public RecommendationResponse(Long id, Long opportunityId, String title, String company, 
                                  String type, String location, int matchScore, 
                                  List<String> matchedSkills, List<String> missingSkills, 
                                  List<String> requiredSkills, String reason, 
                                  String salaryOrStipend, String opportunityType, 
                                  String duration, String description) {
        this.id = id;
        this.opportunityId = opportunityId;
        this.title = title;
        this.company = company;
        this.type = type;
        this.location = location;
        this.matchScore = matchScore;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.requiredSkills = requiredSkills;
        this.reason = reason;
        this.salaryOrStipend = salaryOrStipend;
        this.opportunityType = opportunityType;
        this.duration = duration;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOpportunityId() {
        return opportunityId;
    }

    public void setOpportunityId(Long opportunityId) {
        this.opportunityId = opportunityId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getSalaryOrStipend() {
        return salaryOrStipend;
    }

    public void setSalaryOrStipend(String salaryOrStipend) {
        this.salaryOrStipend = salaryOrStipend;
    }

    public String getOpportunityType() {
        return opportunityType;
    }

    public void setOpportunityType(String opportunityType) {
        this.opportunityType = opportunityType;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
