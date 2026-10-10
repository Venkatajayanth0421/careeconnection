package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.LoginRequest;
import com.jobportal.entity.Admin;
import com.jobportal.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // POST /api/admin/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Admin>> loginAdmin(@Valid @RequestBody LoginRequest loginRequest) {
        Admin admin = adminService.loginAdmin(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(ApiResponse.success("Admin login successful!", admin));
    }

    // GET /api/admin/stats
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched successfully", stats));
    }
}
