package com.jobportal.config;

import com.jobportal.entity.Admin;
import com.jobportal.entity.Internship;
import com.jobportal.entity.Job;
import com.jobportal.entity.Student;
import com.jobportal.repository.AdminRepository;
import com.jobportal.repository.InternshipRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(AdminRepository adminRepo,
                                          JobRepository jobRepo,
                                          InternshipRepository internshipRepo,
                                          StudentRepository studentRepo) {
        return args -> {
            // Seed Admin if not exists
            if (adminRepo.count() == 0) {
                Admin admin = new Admin();
                admin.setUsername("admin");
                admin.setPassword("admin123");
                adminRepo.save(admin);
                System.out.println(">>> Sample Admin created: admin / admin123");
            }

            // Seed sample Student if not exists
            if (studentRepo.count() == 0) {
                Student s = new Student();
                s.setName("Rahul Sharma");
                s.setEmail("rahul@example.com");
                s.setPassword("password123");
                s.setPhone("9876543210");
                s.setSkills("Java, Spring Boot, React, MySQL");
                s.setQualification("B.Tech Computer Science");
                s.setPreferredLocation("Bangalore, Hyderabad");
                s.setInterests("Software Development, Backend Engineering");
                studentRepo.save(s);
                System.out.println(">>> Sample Student created: rahul@example.com / password123");
            }

            // Seed sample Jobs if empty
            if (jobRepo.count() == 0) {
                jobRepo.save(new Job(null,
                        "Junior Java Developer",
                        "TechNova Solutions",
                        "Bangalore, India",
                        "We are looking for a passionate Junior Java Developer proficient in Core Java, Spring Boot, and REST APIs. You will work on designing scalable backend services, optimizing SQL queries, and collaborating with frontend teams.",
                        "Java, Spring Boot, MySQL, REST APIs, Git",
                        "₹6.5 - 8.5 LPA",
                        "Full-time",
                        LocalDate.now().minusDays(3)));

                jobRepo.save(new Job(null,
                        "Full Stack React & Node Developer",
                        "InnoWave Digital",
                        "Hyderabad, India",
                        "Exciting opportunity for a Full Stack Developer experienced with modern React.js, responsive web designs, RESTful microservices, and relational databases. Freshers with strong project portfolio welcome!",
                        "React.js, Node.js, JavaScript, HTML5, CSS3, SQL",
                        "₹7.0 - 9.0 LPA",
                        "Full-time",
                        LocalDate.now().minusDays(5)));

                jobRepo.save(new Job(null,
                        "Cloud & DevOps Associate",
                        "SkyNet Cloud Systems",
                        "Pune, India",
                        "Seeking a Cloud & DevOps engineer to manage CI/CD pipelines, Docker containers, AWS deployment, and Linux server environments.",
                        "AWS, Docker, Linux, CI/CD, Git",
                        "₹6.0 - 8.0 LPA",
                        "Remote",
                        LocalDate.now().minusDays(7)));

                jobRepo.save(new Job(null,
                        "Data Analyst Engineer",
                        "Quantum Metrics Inc",
                        "Delhi NCR, India",
                        "Analyze large datasets, develop insightful dashboards using PowerBI/Tableau, and write complex SQL queries to solve business problems.",
                        "Python, SQL, PowerBI, Excel, Data Modeling",
                        "₹5.5 - 7.5 LPA",
                        "Hybrid",
                        LocalDate.now().minusDays(10)));
                System.out.println(">>> Sample Jobs created successfully!");
            }

            // Seed sample Internships if empty
            if (internshipRepo.count() == 0) {
                internshipRepo.save(new Internship(null,
                        "Frontend Web Development Intern",
                        "CodeCrafters Studio",
                        "Remote",
                        "Join our frontend team to build modern, responsive web user interfaces using React.js and CSS. You will convert design wireframes into clean, interactive web components.",
                        "React.js, JavaScript, CSS3, HTML5",
                        "₹15,000 / month",
                        "3 Months",
                        "Virtual/Remote",
                        LocalDate.now().minusDays(2)));

                internshipRepo.save(new Internship(null,
                        "Backend Java Spring Boot Intern",
                        "Apex Software Labs",
                        "Bangalore, India",
                        "Great learning opportunity for B.Tech students! Work alongside senior software engineers building high-performance REST APIs, database schemas, and unit tests.",
                        "Java, Spring Boot, MySQL, REST APIs",
                        "₹20,000 / month",
                        "6 Months",
                        "Full-time",
                        LocalDate.now().minusDays(4)));

                internshipRepo.save(new Internship(null,
                        "AI & Python Machine Learning Intern",
                        "Cognitive Minds Lab",
                        "Hyderabad, India",
                        "Assist in developing machine learning models, data preprocessing pipelines, and exploratory data analysis using Python, NumPy, and Pandas.",
                        "Python, Pandas, NumPy, Machine Learning",
                        "₹18,000 / month",
                        "3 Months",
                        "Hybrid",
                        LocalDate.now().minusDays(6)));

                internshipRepo.save(new Internship(null,
                        "UI/UX Design & Research Intern",
                        "PixelCraft Agency",
                        "Mumbai, India",
                        "Conduct user research, design wireframes and high-fidelity mockups in Figma, and collaborate with developers to ensure pixel-perfect implementation.",
                        "Figma, Wireframing, Prototyping, UI/UX Design",
                        "₹12,000 / month",
                        "2 Months",
                        "Part-time",
                        LocalDate.now().minusDays(8)));
                System.out.println(">>> Sample Internships created successfully!");
            }
        };
    }
}
