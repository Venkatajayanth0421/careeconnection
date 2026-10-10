package com.jobportal.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = true)
    private Job job;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "internship_id", nullable = true)
    private Internship internship;

    private LocalDate applicationDate;

    // Status: PENDING, SHORTLISTED, ACCEPTED, REJECTED
    @Column(nullable = false)
    private String status = "PENDING";

    @PrePersist
    public void prePersist() {
        if (this.applicationDate == null) {
            this.applicationDate = LocalDate.now();
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "PENDING";
        }
    }

    public Application() {
    }

    public Application(Long id, Student student, Job job, Internship internship, LocalDate applicationDate, String status) {
        this.id = id;
        this.student = student;
        this.job = job;
        this.internship = internship;
        this.applicationDate = applicationDate;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public Internship getInternship() {
        return internship;
    }

    public void setInternship(Internship internship) {
        this.internship = internship;
    }

    public LocalDate getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
