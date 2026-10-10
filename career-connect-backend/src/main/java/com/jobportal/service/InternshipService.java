package com.jobportal.service;

import com.jobportal.entity.Internship;
import com.jobportal.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InternshipService {

    private final InternshipRepository internshipRepository;

    @Autowired
    public InternshipService(InternshipRepository internshipRepository) {
        this.internshipRepository = internshipRepository;
    }

    public List<Internship> getAllInternships() {
        return internshipRepository.findAllByOrderByPostedDateDesc();
    }

    public Internship getInternshipById(Long id) {
        return internshipRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Internship not found with ID: " + id));
    }

    public Internship createInternship(Internship internship) {
        return internshipRepository.save(internship);
    }

    public Internship updateInternship(Long id, Internship updatedInternship) {
        Internship existing = getInternshipById(id);
        existing.setTitle(updatedInternship.getTitle());
        existing.setCompany(updatedInternship.getCompany());
        existing.setLocation(updatedInternship.getLocation());
        existing.setDescription(updatedInternship.getDescription());
        existing.setSkills(updatedInternship.getSkills());
        existing.setStipend(updatedInternship.getStipend());
        existing.setDuration(updatedInternship.getDuration());
        existing.setInternshipType(updatedInternship.getInternshipType());
        if (updatedInternship.getPostedDate() != null) {
            existing.setPostedDate(updatedInternship.getPostedDate());
        }
        return internshipRepository.save(existing);
    }

    public void deleteInternship(Long id) {
        if (!internshipRepository.existsById(id)) {
            throw new IllegalArgumentException("Internship not found with ID: " + id);
        }
        internshipRepository.deleteById(id);
    }

    public List<Internship> searchInternships(String keyword, String location, String internshipType) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String cleanLocation = (location != null && !location.trim().isEmpty()) ? location.trim() : null;
        String cleanType = (internshipType != null && !internshipType.trim().isEmpty()) ? internshipType.trim() : null;

        if (cleanKeyword == null && cleanLocation == null && cleanType == null) {
            return getAllInternships();
        }
        return internshipRepository.searchInternships(cleanKeyword, cleanLocation, cleanType);
    }
}
