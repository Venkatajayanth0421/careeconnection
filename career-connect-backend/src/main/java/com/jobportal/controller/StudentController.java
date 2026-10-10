package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.LoginRequest;
import com.jobportal.entity.Student;
import com.jobportal.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // POST /api/students/register
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Student>> registerStudent(@Valid @RequestBody Student student) {
        Student savedStudent = studentService.registerStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student registered successfully!", savedStudent));
    }

    // POST /api/students/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Student>> loginStudent(@Valid @RequestBody LoginRequest loginRequest) {
        Student student = studentService.loginStudent(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(ApiResponse.success("Login successful!", student));
    }

    // GET /api/students/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student fetched successfully", student));
    }

    // PUT /api/students/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> updateStudentProfile(@PathVariable Long id, @RequestBody Student student) {
        Student updated = studentService.updateStudentProfile(id, student);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully!", updated));
    }
}
