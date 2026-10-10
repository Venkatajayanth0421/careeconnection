package com.jobportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JobPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobPortalApplication.class, args);
        System.out.println("=================================================");
        System.out.println("   Job & Internship Portal Backend is Running!   ");
        System.out.println("   API Base URL: http://localhost:8080/api       ");
        System.out.println("=================================================");
    }
}
