-- ==========================================================
-- Job & Internship Portal - Database Schema
-- Database: MySQL 8.0+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS job_portal_db;
USE job_portal_db;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    skills VARCHAR(255),
    qualification VARCHAR(100)
);

-- 2. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT,
    skills VARCHAR(255),
    salary VARCHAR(50),
    job_type VARCHAR(50),
    posted_date DATE
);

-- 3. Internships Table
CREATE TABLE IF NOT EXISTS internships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT,
    skills VARCHAR(255),
    stipend VARCHAR(50),
    duration VARCHAR(50),
    internship_type VARCHAR(50),
    posted_date DATE
);

-- 4. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    job_id BIGINT NULL,
    internship_id BIGINT NULL,
    application_date DATE,
    status VARCHAR(50) DEFAULT 'PENDING',
    CONSTRAINT fk_application_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_application_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_application_internship FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE
);

-- 5. Admin Table
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
