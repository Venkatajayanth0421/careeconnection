# 🎓 CareerConnect - Job & Internship Portal (Full-Stack B.Tech Project)

A complete, beginner-friendly, and modern full-stack web application designed for college placements and industrial internships. Built using **Spring Boot (Java)**, **MySQL**, and **React.js**.

---

## 🌟 Tech Stack

- **Frontend:** React.js, React Router v7, Axios, Lucide Icons, Pure CSS (Modern Design System)
- **Backend:** Java 17+, Spring Boot 3.2.x, Spring Data JPA, Spring Web, Hibernate
- **Database:** MySQL 8.0+
- **Architecture:** Layered REST Architecture (Controller → Service → Repository → Entity)

---

## 📁 Project Directory Structure

```text
CareerConnect/
│
├── career-connect-backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/jobportal/
│       │   │   ├── JobPortalApplication.java       # Main Spring Boot Runner
│       │   │   ├── config/
│       │   │   │   ├── CorsConfig.java             # CORS for React (port 5173/3000)
│       │   │   │   ├── DataInitializer.java       # Auto-seeds default data on first run
│       │   │   │   └── GlobalExceptionHandler.java # Clean API error formatting
│       │   │   ├── controller/
│       │   │   │   ├── StudentController.java      # Student auth & profile APIs
│       │   │   │   ├── JobController.java          # Jobs CRUD & search APIs
│       │   │   │   ├── InternshipController.java   # Internships CRUD & search APIs
│       │   │   │   ├── ApplicationController.java  # Student application submission & review
│       │   │   │   └── AdminController.java        # Admin login & dashboard metrics
│       │   │   ├── dto/
│       │   │   │   ├── ApiResponse.java
│       │   │   │   ├── ApplicationRequest.java
│       │   │   │   ├── LoginRequest.java
│       │   │   │   └── StatusUpdateRequest.java
│       │   │   ├── entity/
│       │   │   │   ├── Student.java                # Student Entity
│       │   │   │   ├── Job.java                    # Job Entity
│       │   │   │   ├── Internship.java             # Internship Entity
│       │   │   │   ├── Application.java            # Application Entity with Foreign Keys
│       │   │   │   └── Admin.java                  # Admin Entity
│       │   │   ├── repository/
│       │   │   │   ├── StudentRepository.java
│       │   │   │   ├── JobRepository.java
│       │   │   │   ├── InternshipRepository.java
│       │   │   │   ├── ApplicationRepository.java
│       │   │   │   └── AdminRepository.java
│       │   │   └── service/
│       │   │       ├── StudentService.java
│       │   │       ├── JobService.java
│       │   │       ├── InternshipService.java
│       │   │       ├── ApplicationService.java
│       │   │       └── AdminService.java
│       │   └── resources/
│       │       ├── application.properties          # MySQL Connection Config
│       │       ├── schema.sql                      # DDL Database Tables Schema
│       │       └── sample_data.sql                 # Sample Records for Testing
│
├── career-connect-frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── api/
│       │   └── api.js                              # Axios REST API Client
│       ├── context/
│       │   └── AuthContext.jsx                     # Student & Admin Session Management
│       ├── components/
│       │   ├── Navbar.jsx                          # Dynamic Responsive Nav Header
│       │   ├── Footer.jsx                          # Page Footer
│       │   ├── JobCard.jsx                         # Job Listing Card
│       │   ├── InternshipCard.jsx                  # Internship Listing Card
│       │   ├── SearchFilterBar.jsx                 # Search & Multi-criteria Filter Bar
│       │   └── AlertNotification.jsx               # Success / Error Toast Alerts
│       ├── pages/
│       │   ├── Home.jsx                            # Landing Page with Hero & Stats
│       │   ├── StudentLogin.jsx                    # Student Sign In
│       │   ├── StudentRegister.jsx                 # Student Registration Form
│       │   ├── StudentDashboard.jsx                # Student Placement Dashboard
│       │   ├── JobsList.jsx                        # All Jobs Listing with Search & Filters
│       │   ├── JobDetails.jsx                      # Job Specs & Apply Modal
│       │   ├── InternshipsList.jsx                 # All Internships Listing
│       │   ├── InternshipDetails.jsx               # Internship Specs & Apply
│       │   ├── MyApplications.jsx                  # Student Applied Jobs Tracker
│       │   ├── AdminLogin.jsx                      # Admin Portal Access
│       │   ├── AdminDashboard.jsx                  # Placement Statistics & Status Controls
│       │   ├── AddOpportunity.jsx                  # Post New Job / Internship Form
│       │   └── EditOpportunity.jsx                 # Modify Existing Opportunity
│       ├── App.jsx                                 # Routes configuration
│       ├── App.css                                 # Component & Modal Styles
│       └── index.css                               # Design Tokens & Utilities
│
├── run_backend.bat                                 # One-click Windows runner for Backend
└── run_frontend.bat                                # One-click Windows runner for Frontend
```

---

## 🚀 How to Run the Project

### Step 1: MySQL Database Setup

1. Open MySQL Workbench or MySQL Command Line Client.
2. Login with your MySQL root user.
3. The database `job_portal_db` will automatically be created by Spring Boot on startup because `createDatabaseIfNotExist=true` is enabled in `application.properties`.
4. Alternatively, you can run the provided SQL script:
   - File: `career-connect-backend/src/main/resources/schema.sql`
   - File: `career-connect-backend/src/main/resources/sample_data.sql`

Check/edit `career-connect-backend/src/main/resources/application.properties` to ensure your password matches:
```properties
spring.datasource.username=root
spring.datasource.password=root
```

---

### Step 2: Run the Spring Boot Backend

You can run the backend in any of these ways:

#### Option A (Recommended for IDE):
1. Open **IntelliJ IDEA**, **Eclipse**, or **VS Code**.
2. Open the `career-connect-backend` folder.
3. Locate `src/main/java/com/jobportal/JobPortalApplication.java`.
4. Right-click and choose **Run 'JobPortalApplication'**.
5. The server will start on port `8080`.

#### Option B (Command Line with Maven):
```bash
cd career-connect-backend
mvn spring-boot:run
```
*(Or double click `run_backend.bat`)*

Once started, the backend REST APIs will be live at:
`http://localhost:8080/api`

---

### Step 3: Run the React Frontend

Open a new terminal window:
```bash
cd career-connect-frontend
npm install
npm run dev
```
*(Or double click `run_frontend.bat`)*
*(Or double click `run_frontend.bat`)*

Open your browser at:
`http://localhost:5173`

---

## 🔑 Default Credentials for Testing

### 1. Admin Portal
- **URL:** http://localhost:5173/admin/login
- **Username:** `admin`
- **Password:** `admin123`
*(Features ⚡ 1-click Auto-Fill button on the login screen!)*

### 2. Sample Student Account
- **URL:** http://localhost:5173/student/login
- **Email:** `rahul@example.com`
- **Password:** `password123`
*(Features ⚡ 1-click Auto-Fill button on the login screen!)*

---

## 📡 REST API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/students/register` | Register a new student |
| `POST` | `/api/students/login` | Student login |
| `GET` | `/api/students/{id}` | Get student profile |
| `GET` | `/api/jobs` | Get all jobs (with query filters: keyword, location, jobType) |
| `GET` | `/api/jobs/{id}` | Get job details |
| `POST` | `/api/jobs` | Create job (Admin) |
| `PUT` | `/api/jobs/{id}` | Update job (Admin) |
| `DELETE` | `/api/jobs/{id}` | Delete job (Admin) |
| `GET` | `/api/internships` | Get all internships (with query filters) |
| `GET` | `/api/internships/{id}` | Get internship details |
| `POST` | `/api/internships` | Create internship (Admin) |
| `PUT` | `/api/internships/{id}` | Update internship (Admin) |
| `DELETE` | `/api/internships/{id}` | Delete internship (Admin) |
| `POST` | `/api/applications` | Student submits application |
| `GET` | `/api/applications/student/{studentId}` | Get student applications |
| `GET` | `/api/applications` | Get all applications (Admin) |
| `PUT` | `/api/applications/{id}/status` | Update status (PENDING / SHORTLISTED / ACCEPTED / REJECTED) |
| `POST` | `/api/admin/login` | Admin login |
| `GET` | `/api/admin/stats` | Dashboard statistics (total jobs, apps, statuses) |
