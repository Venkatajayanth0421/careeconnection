package com.jobportal.service;

import com.jobportal.dto.RecommendationResponse;
import com.jobportal.dto.StudentRecommendationResult;
import com.jobportal.entity.Internship;
import com.jobportal.entity.Job;
import com.jobportal.entity.Student;
import com.jobportal.repository.InternshipRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * AI Recommendation Service for Jobs and Internships
 *
 * Designed for College B.Tech Placement Portals.
 * Implements a weighted skill-compatibility matching algorithm based on:
 * 1. Technical Skills overlap (Direct & Fuzzy Keyword Match)
 * 2. Academic Qualification compatibility
 * 3. Geographic / Location preference
 * 4. Job Title & Student Domain Interests
 * 5. Full Job Description Context
 *
 * Cleanly structured with modular AI extension points for LLM integration (OpenAI / Gemini).
 */
@Service
public class AIRecommendationService {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final InternshipRepository internshipRepository;

    @Autowired
    public AIRecommendationService(StudentRepository studentRepository,
                                   JobRepository jobRepository,
                                   InternshipRepository internshipRepository) {
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.internshipRepository = internshipRepository;
    }

    /**
     * Primary Recommendation API for a registered student.
     * Evaluates all open jobs and internships against the student's profile.
     */
    public StudentRecommendationResult getRecommendationsForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

        return generateRecommendations(
                student.getId(),
                student.getName(),
                student.getSkills(),
                student.getQualification(),
                student.getPreferredLocation(),
                student.getInterests()
        );
    }

    /**
     * Guest / Interactive Recommendation API
     * Evaluates open opportunities based on provided skills, qualification, and location.
     */
    public StudentRecommendationResult getGuestRecommendations(String skills, String qualification, 
                                                               String location, String interests) {
        return generateRecommendations(
                null,
                "Student Guest",
                skills,
                qualification,
                location,
                interests
        );
    }

    /**
     * Core Algorithm: Computes match percentage, matched skills, missing skills,
     * and dynamic recommendation explanations.
     */
    private StudentRecommendationResult generateRecommendations(Long studentId,
                                                                 String studentName,
                                                                 String rawStudentSkills,
                                                                 String qualification,
                                                                 String preferredLocation,
                                                                 String interests) {
        List<String> studentSkillList = parseSkills(rawStudentSkills);
        Set<String> normalizedStudentSkills = studentSkillList.stream()
                .map(this::normalizeSkill)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        List<Job> allJobs = jobRepository.findAll();
        List<Internship> allInternships = internshipRepository.findAll();

        List<RecommendationResponse> recommendations = new ArrayList<>();

        // 1. Process Jobs
        for (Job job : allJobs) {
            RecommendationResponse rec = evaluateOpportunity(
                    job.getId(),
                    job.getId(),
                    job.getTitle(),
                    job.getCompany(),
                    "Job",
                    job.getLocation(),
                    job.getSkills(),
                    job.getDescription(),
                    job.getSalary(),
                    job.getJobType(),
                    null,
                    normalizedStudentSkills,
                    studentSkillList,
                    qualification,
                    preferredLocation,
                    interests
            );
            recommendations.add(rec);
        }

        // 2. Process Internships
        for (Internship internship : allInternships) {
            RecommendationResponse rec = evaluateOpportunity(
                    internship.getId(),
                    internship.getId(),
                    internship.getTitle(),
                    internship.getCompany(),
                    "Internship",
                    internship.getLocation(),
                    internship.getSkills(),
                    internship.getDescription(),
                    internship.getStipend(),
                    internship.getInternshipType(),
                    internship.getDuration(),
                    normalizedStudentSkills,
                    studentSkillList,
                    qualification,
                    preferredLocation,
                    interests
            );
            recommendations.add(rec);
        }

        // 3. Sort opportunities: Highest match score to lowest
        recommendations.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));

        // 4. Calculate "Improve Your Match" recommendations:
        // Aggregate the most frequent missing skills from the student's top opportunities
        Map<String, Integer> missingSkillFrequency = new LinkedHashMap<>();
        int evaluatedCount = Math.min(recommendations.size(), 8);
        for (int i = 0; i < evaluatedCount; i++) {
            for (String missing : recommendations.get(i).getMissingSkills()) {
                String cleanMissing = missing.trim();
                missingSkillFrequency.put(cleanMissing, missingSkillFrequency.getOrDefault(cleanMissing, 0) + 1);
            }
        }

        List<String> topRecommendedSkillsToLearn = missingSkillFrequency.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .map(Map.Entry::getKey)
                .limit(4)
                .collect(Collectors.toList());

        // Fallback default skills if no missing skills found
        if (topRecommendedSkillsToLearn.isEmpty() && !studentSkillList.isEmpty()) {
            topRecommendedSkillsToLearn = Arrays.asList("Docker", "AWS", "Microservices");
        }

        // 5. Average match score across top matches
        int currentAverageMatch = 0;
        if (!recommendations.isEmpty()) {
            int topCount = Math.min(recommendations.size(), 4);
            int sum = 0;
            for (int i = 0; i < topCount; i++) {
                sum += recommendations.get(i).getMatchScore();
            }
            currentAverageMatch = sum / topCount;
        }

        return new StudentRecommendationResult(
                studentId,
                studentName,
                studentSkillList,
                qualification,
                preferredLocation,
                currentAverageMatch,
                topRecommendedSkillsToLearn,
                recommendations
        );
    }

    /**
     * Evaluates a single opportunity (Job or Internship) against student profile.
     */
    private RecommendationResponse evaluateOpportunity(Long id,
                                                        Long opportunityId,
                                                        String title,
                                                        String company,
                                                        String type,
                                                        String location,
                                                        String rawRequiredSkills,
                                                        String description,
                                                        String salaryOrStipend,
                                                        String opportunityType,
                                                        String duration,
                                                        Set<String> normalizedStudentSkills,
                                                        List<String> originalStudentSkills,
                                                        String qualification,
                                                        String preferredLocation,
                                                        String interests) {

        List<String> requiredSkillList = parseSkills(rawRequiredSkills);
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        int matchedCount = 0;

        for (String reqSkill : requiredSkillList) {
            String normReq = normalizeSkill(reqSkill);
            if (isSkillMatched(normReq, normalizedStudentSkills)) {
                matchedSkills.add(reqSkill);
                matchedCount++;
            } else {
                missingSkills.add(reqSkill);
            }
        }

        // ========================================================
        // Skill-based recommendation algorithm (suitable for B.Tech project):
        // Skill percentage = (matched skills / required skills) * 100%
        // E.g. Matched 3 of 4 => 75%
        // ========================================================
        int totalRequired = requiredSkillList.size();
        double skillPercent = (totalRequired > 0) ? ((double) matchedCount / totalRequired) * 100.0 : 50.0;

        // Base score from skill match (80% weight) + Contextual relevance bonus (up to 20%)
        double baseScore = skillPercent * 0.80;

        // Title and Interest relevance bonus (up to 10%)
        double titleBonus = 0.0;
        String titleLower = (title != null) ? title.toLowerCase() : "";
        String descLower = (description != null) ? description.toLowerCase() : "";
        String interestsLower = (interests != null) ? interests.toLowerCase() : "";

        for (String studentSkill : normalizedStudentSkills) {
            if (titleLower.contains(studentSkill)) {
                titleBonus += 5.0;
                break;
            }
        }
        if (!interestsLower.isEmpty()) {
            for (String part : interestsLower.split("[,\\s]+")) {
                if (part.length() > 2 && (titleLower.contains(part) || descLower.contains(part))) {
                    titleBonus += 4.0;
                    break;
                }
            }
        }
        for (String studentSkill : normalizedStudentSkills) {
            if (descLower.contains(studentSkill)) {
                titleBonus += 3.0;
                break;
            }
        }
        titleBonus = Math.min(10.0, titleBonus);

        // Location & Qualification bonus (up to 10%)
        double locQualBonus = 4.0;
        String locLower = (location != null) ? location.toLowerCase() : "";
        String prefLocLower = (preferredLocation != null) ? preferredLocation.toLowerCase() : "";

        if (locLower.contains("remote") || prefLocLower.isEmpty() || locLower.contains(prefLocLower)) {
            locQualBonus += 4.0;
        }

        if (qualification != null && !qualification.trim().isEmpty()) {
            String qualLower = qualification.toLowerCase();
            if (qualLower.contains("b.tech") || qualLower.contains("btech") || 
                qualLower.contains("cs") || qualLower.contains("it") || 
                qualLower.contains("computer") || qualLower.contains("mca")) {
                locQualBonus += 2.0;
            }
        }
        locQualBonus = Math.min(10.0, locQualBonus);

        // Final Match Score (0 - 100)
        int finalScore = (int) Math.round(baseScore + titleBonus + locQualBonus);
        if (matchedCount == totalRequired && totalRequired > 0) {
            finalScore = Math.max(finalScore, 95);
        } else if (matchedCount >= 3 && (totalRequired - matchedCount <= 1)) {
            finalScore = Math.max(finalScore, 88);
        }
        finalScore = Math.max(10, Math.min(100, finalScore));

        // Generate Human-friendly AI Explanation
        String reason = generateAIExplanation(title, type, matchedSkills, missingSkills, finalScore);

        return new RecommendationResponse(
                id,
                opportunityId,
                title,
                company,
                type,
                location,
                finalScore,
                matchedSkills,
                missingSkills,
                requiredSkillList,
                reason,
                salaryOrStipend,
                opportunityType,
                duration,
                description
        );
    }

    /**
     * Generates a clear, professional reasoning string for why this position was recommended.
     * Ready for LLM prompt augmentation if an external AI API is plugged in.
     */
    private String generateAIExplanation(String title, String type, List<String> matchedSkills, 
                                          List<String> missingSkills, int matchScore) {
        if (!matchedSkills.isEmpty()) {
            String matchedJoined;
            if (matchedSkills.size() <= 2) {
                matchedJoined = String.join(" and ", matchedSkills);
            } else {
                int lastIdx = matchedSkills.size() - 1;
                matchedJoined = String.join(", ", matchedSkills.subList(0, lastIdx)) + " and " + matchedSkills.get(lastIdx);
            }

            if (matchScore >= 75) {
                return "Your " + matchedJoined + " skills strongly match the requirements of this position.";
            } else if (matchScore >= 55) {
                return "Your " + matchedJoined + " skills align with this position. Acquiring " +
                        (missingSkills.isEmpty() ? "further domain tools" : missingSkills.get(0)) + " will give you an edge.";
            } else {
                return "Your " + matchedJoined + " knowledge provides a good foundation for this position.";
            }
        } else {
            return "Recommended as an entry opportunity for " + title + " to broaden your portfolio.";
        }
    }

    /**
     * Extensibility Hook: Demonstrates how to connect an external LLM
     * (e.g. OpenAI GPT-4o, Google Gemini, Ollama) if desired.
     */
    public String generateAIEnhancedReasonWithLLM(String studentSkills, String jobDetails) {
        // [FUTURE EXTENSION]: Call Spring AI or HttpClient to Gemini / OpenAI
        // return openAiClient.prompt("Explain job match for student: " + studentSkills + " with job: " + jobDetails);
        return "AI analysis confirms strong contextual alignment with your technical profile.";
    }

    /**
     * Checks if a required skill matches any of the student's normalized skills.
     * Supports aliases (e.g. "react" == "react.js", "js" == "javascript").
     */
    private boolean isSkillMatched(String requiredSkill, Set<String> studentSkills) {
        if (studentSkills.contains(requiredSkill)) {
            return true;
        }

        // Fuzzy / alias checks
        for (String sSkill : studentSkills) {
            if (sSkill.equals(requiredSkill)) return true;
            if (sSkill.contains(requiredSkill) || requiredSkill.contains(sSkill)) {
                // Ensure word boundary or substantial substring
                if (Math.abs(sSkill.length() - requiredSkill.length()) <= 4) {
                    return true;
                }
            }
            // Common tech aliases
            if (isAlias(sSkill, requiredSkill)) {
                return true;
            }
        }
        return false;
    }

    private boolean isAlias(String s1, String s2) {
        if ((s1.contains("react") && s2.contains("react")) ||
            (s1.contains("spring") && s2.contains("spring")) ||
            (s1.contains("node") && s2.contains("node")) ||
            (s1.contains("sql") && s2.contains("sql")) ||
            (s1.contains("python") && s2.contains("python")) ||
            (s1.contains("ml") || s1.contains("machine learning")) && (s2.contains("ml") || s2.contains("machine learning")) ||
            (s1.contains("api") && s2.contains("api")) ||
            (s1.contains("aws") && s2.contains("cloud")) ||
            (s1.contains("figma") || s1.contains("ui")) && (s2.contains("figma") || s2.contains("ui"))) {
            return true;
        }
        return false;
    }

    private List<String> parseSkills(String raw) {
        if (raw == null || raw.trim().isEmpty()) {
            return new ArrayList<>();
        }
        String[] parts = raw.split("[,;•|\\n]+");
        List<String> list = new ArrayList<>();
        for (String p : parts) {
            String trimmed = p.trim();
            if (!trimmed.isEmpty()) {
                list.add(trimmed);
            }
        }
        return list;
    }

    private String normalizeSkill(String skill) {
        if (skill == null) return "";
        return skill.toLowerCase()
                .replaceAll("\\.js$", "")
                .replaceAll("[^a-z0-9+#]", "")
                .trim();
    }
}
