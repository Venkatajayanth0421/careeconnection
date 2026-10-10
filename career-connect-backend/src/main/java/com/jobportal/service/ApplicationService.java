package com.jobportal.service;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.entity.Application;
import com.jobportal.entity.Internship;
import com.jobportal.entity.Job;
import com.jobportal.entity.Student;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.InternshipRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final InternshipRepository internshipRepository;

    @Autowired
    public ApplicationService(ApplicationRepository applicationRepository,
                              StudentRepository studentRepository,
                              JobRepository jobRepository,
                              InternshipRepository internshipRepository) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.internshipRepository = internshipRepository;
    }

    public Application apply(ApplicationRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + request.getStudentId()));

        Application application = new Application();
        application.setStudent(student);
        application.setApplicationDate(LocalDate.now());
        application.setStatus("PENDING");

        if (request.getJobId() != null) {
            if (applicationRepository.existsByStudentIdAndJobId(request.getStudentId(), request.getJobId())) {
                throw new IllegalArgumentException("You have already applied for this job!");
            }
            Job job = jobRepository.findById(request.getJobId())
                    .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + request.getJobId()));
            application.setJob(job);
        } else if (request.getInternshipId() != null) {
            if (applicationRepository.existsByStudentIdAndInternshipId(request.getStudentId(), request.getInternshipId())) {
                throw new IllegalArgumentException("You have already applied for this internship!");
            }
            Internship internship = internshipRepository.findById(request.getInternshipId())
                    .orElseThrow(() -> new IllegalArgumentException("Internship not found with ID: " + request.getInternshipId()));
            application.setInternship(internship);
        } else {
            throw new IllegalArgumentException("Either Job ID or Internship ID must be specified");
        }

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByStudentId(Long studentId) {
        return applicationRepository.findByStudentIdOrderByApplicationDateDesc(studentId);
    }

    public List<Application> getApplicationsByJobId(Long jobId) {
        return applicationRepository.findByJobIdOrderByApplicationDateDesc(jobId);
    }

    public List<Application> getApplicationsByInternshipId(Long internshipId) {
        return applicationRepository.findByInternshipIdOrderByApplicationDateDesc(internshipId);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAllByOrderByApplicationDateDesc();
    }

    public Application updateApplicationStatus(Long id, String status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with ID: " + id));

        String cleanStatus = status.trim().toUpperCase();
        if (!List.of("PENDING", "SHORTLISTED", "ACCEPTED", "REJECTED").contains(cleanStatus)) {
            throw new IllegalArgumentException("Invalid status: " + status + ". Allowed values: PENDING, SHORTLISTED, ACCEPTED, REJECTED");
        }

        application.setStatus(cleanStatus);
        return applicationRepository.save(application);
    }
}
