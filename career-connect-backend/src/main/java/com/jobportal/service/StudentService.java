package com.jobportal.service;

import com.jobportal.entity.Student;
import com.jobportal.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student registerStudent(Student student) {
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + student.getEmail());
        }
        return studentRepository.save(student);
    }

    public Student loginStudent(String email, String password) {
        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isEmpty()) {
            throw new IllegalArgumentException("No account found with this email");
        }
        Student student = studentOpt.get();
        if (!student.getPassword().equals(password)) {
            throw new IllegalArgumentException("Invalid password");
        }
        return student;
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));
    }

    public Student updateStudentProfile(Long id, Student updated) {
        Student student = getStudentById(id);
        if (updated.getName() != null && !updated.getName().trim().isEmpty()) {
            student.setName(updated.getName().trim());
        }
        if (updated.getPhone() != null) {
            student.setPhone(updated.getPhone());
        }
        if (updated.getSkills() != null) {
            student.setSkills(updated.getSkills());
        }
        if (updated.getQualification() != null) {
            student.setQualification(updated.getQualification());
        }
        if (updated.getPreferredLocation() != null) {
            student.setPreferredLocation(updated.getPreferredLocation());
        }
        if (updated.getInterests() != null) {
            student.setInterests(updated.getInterests());
        }
        return studentRepository.save(student);
    }
}
