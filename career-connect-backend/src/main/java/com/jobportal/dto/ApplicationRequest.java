package com.jobportal.dto;

import jakarta.validation.constraints.NotNull;

public class ApplicationRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    private Long jobId;

    private Long internshipId;

    public ApplicationRequest() {
    }

    public ApplicationRequest(Long studentId, Long jobId, Long internshipId) {
        this.studentId = studentId;
        this.jobId = jobId;
        this.internshipId = internshipId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Long getInternshipId() {
        return internshipId;
    }

    public void setInternshipId(Long internshipId) {
        this.internshipId = internshipId;
    }
}
