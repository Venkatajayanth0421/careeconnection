package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.ApplicationRequest;
import com.jobportal.dto.StatusUpdateRequest;
import com.jobportal.entity.Application;
import com.jobportal.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // POST /api/applications
    @PostMapping
    public ResponseEntity<ApiResponse<Application>> apply(@Valid @RequestBody ApplicationRequest request) {
        Application application = applicationService.apply(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully!", application));
    }

    // GET /api/applications/student/{studentId}
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<Application>>> getApplicationsByStudent(@PathVariable Long studentId) {
        List<Application> applications = applicationService.getApplicationsByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.success("Applications fetched successfully", applications));
    }

    // GET /api/applications/job/{jobId}
    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<Application>>> getApplicationsByJob(@PathVariable Long jobId) {
        List<Application> applications = applicationService.getApplicationsByJobId(jobId);
        return ResponseEntity.ok(ApiResponse.success("Job applications fetched successfully", applications));
    }

    // GET /api/applications/internship/{internshipId}
    @GetMapping("/internship/{internshipId}")
    public ResponseEntity<ApiResponse<List<Application>>> getApplicationsByInternship(@PathVariable Long internshipId) {
        List<Application> applications = applicationService.getApplicationsByInternshipId(internshipId);
        return ResponseEntity.ok(ApiResponse.success("Internship applications fetched successfully", applications));
    }

    // GET /api/applications (admin view)
    @GetMapping
    public ResponseEntity<ApiResponse<List<Application>>> getAllApplications() {
        List<Application> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(ApiResponse.success("All applications fetched successfully", applications));
    }

    // PUT /api/applications/{id}/status
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Application>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest statusUpdateRequest) {
        Application updated = applicationService.updateApplicationStatus(id, statusUpdateRequest.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Application status updated to: " + updated.getStatus(), updated));
    }
}
