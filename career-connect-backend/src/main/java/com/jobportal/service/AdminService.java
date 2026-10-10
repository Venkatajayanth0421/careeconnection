package com.jobportal.service;

import com.jobportal.entity.Admin;
import com.jobportal.repository.AdminRepository;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.InternshipRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final JobRepository jobRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public AdminService(AdminRepository adminRepository,
                        JobRepository jobRepository,
                        InternshipRepository internshipRepository,
                        ApplicationRepository applicationRepository,
                        StudentRepository studentRepository) {
        this.adminRepository = adminRepository;
        this.jobRepository = jobRepository;
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
    }

    public Admin loginAdmin(String username, String password) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid admin username");
        }
        Admin admin = adminOpt.get();
        if (!admin.getPassword().equals(password)) {
            throw new IllegalArgumentException("Invalid admin password");
        }
        return admin;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalJobs = jobRepository.count();
        long totalInternships = internshipRepository.count();
        long totalApplications = applicationRepository.count();
        long totalStudents = studentRepository.count();

        long pending = applicationRepository.findAll().stream()
                .filter(a -> "PENDING".equalsIgnoreCase(a.getStatus())).count();
        long shortlisted = applicationRepository.findAll().stream()
                .filter(a -> "SHORTLISTED".equalsIgnoreCase(a.getStatus())).count();
        long accepted = applicationRepository.findAll().stream()
                .filter(a -> "ACCEPTED".equalsIgnoreCase(a.getStatus())).count();
        long rejected = applicationRepository.findAll().stream()
                .filter(a -> "REJECTED".equalsIgnoreCase(a.getStatus())).count();

        stats.put("totalJobs", totalJobs);
        stats.put("totalInternships", totalInternships);
        stats.put("totalApplications", totalApplications);
        stats.put("totalStudents", totalStudents);
        stats.put("pendingApplications", pending);
        stats.put("shortlistedApplications", shortlisted);
        stats.put("acceptedApplications", accepted);
        stats.put("rejectedApplications", rejected);

        return stats;
    }
}
