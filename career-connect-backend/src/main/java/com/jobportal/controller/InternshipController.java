package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.entity.Internship;
import com.jobportal.service.InternshipService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
@CrossOrigin(origins = "*")
public class InternshipController {

    private final InternshipService internshipService;

    @Autowired
    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    // GET /api/internships?keyword=frontend&location=remote&internshipType=Virtual/Remote
    @GetMapping
    public ResponseEntity<ApiResponse<List<Internship>>> getAllInternships(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String internshipType) {
        List<Internship> internships = internshipService.searchInternships(keyword, location, internshipType);
        return ResponseEntity.ok(ApiResponse.success("Internships fetched successfully", internships));
    }

    // GET /api/internships/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Internship>> getInternshipById(@PathVariable Long id) {
        Internship internship = internshipService.getInternshipById(id);
        return ResponseEntity.ok(ApiResponse.success("Internship fetched successfully", internship));
    }

    // POST /api/internships
    @PostMapping
    public ResponseEntity<ApiResponse<Internship>> createInternship(@Valid @RequestBody Internship internship) {
        Internship createdInternship = internshipService.createInternship(internship);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Internship created successfully!", createdInternship));
    }

    // PUT /api/internships/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Internship>> updateInternship(@PathVariable Long id, @Valid @RequestBody Internship internship) {
        Internship updatedInternship = internshipService.updateInternship(id, internship);
        return ResponseEntity.ok(ApiResponse.success("Internship updated successfully!", updatedInternship));
    }

    // DELETE /api/internships/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInternship(@PathVariable Long id) {
        internshipService.deleteInternship(id);
        return ResponseEntity.ok(ApiResponse.success("Internship deleted successfully"));
    }
}
