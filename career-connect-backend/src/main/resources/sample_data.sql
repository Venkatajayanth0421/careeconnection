-- ==========================================================
-- Job & Internship Portal - Sample Test Data
-- ==========================================================

USE job_portal_db;

-- Insert Admin (Username: admin, Password: admin123)
INSERT INTO admins (username, password) VALUES
('admin', 'admin123')
ON DUPLICATE KEY UPDATE username=username;

-- Insert Sample Students
INSERT INTO students (name, email, password, phone, skills, qualification) VALUES
('Rahul Sharma', 'rahul@example.com', 'password123', '9876543210', 'Java, Spring Boot, MySQL, React', 'B.Tech Computer Science'),
('Priya Patel', 'priya@example.com', 'password123', '9812345678', 'Python, Machine Learning, SQL', 'B.Tech IT'),
('Amit Verma', 'amit@example.com', 'password123', '9823456789', 'React.js, JavaScript, Tailwind, Node.js', 'BCA / MCA')
ON DUPLICATE KEY UPDATE email=email;

-- Insert Sample Jobs
INSERT INTO jobs (title, company, location, description, skills, salary, job_type, posted_date) VALUES
('Junior Java Developer', 'TechNova Solutions', 'Bangalore, India', 'We are looking for a passionate Junior Java Developer proficient in Core Java, Spring Boot, and REST APIs. You will work on designing scalable backend services, optimizing SQL queries, and collaborating with frontend teams.', 'Java, Spring Boot, MySQL, REST APIs, Git', '₹6.5 - 8.5 LPA', 'Full-time', CURDATE() - INTERVAL 2 DAY),
('Full Stack React & Node Developer', 'InnoWave Digital', 'Hyderabad, India', 'Exciting opportunity for a Full Stack Developer experienced with modern React.js, responsive web designs, RESTful microservices, and relational databases. Freshers with strong project portfolio welcome!', 'React.js, Node.js, JavaScript, HTML5, CSS3, SQL', '₹7.0 - 9.0 LPA', 'Full-time', CURDATE() - INTERVAL 4 DAY),
('Cloud & DevOps Associate', 'SkyNet Cloud Systems', 'Pune, India', 'Seeking a Cloud & DevOps engineer to manage CI/CD pipelines, Docker containers, AWS deployment, and Linux server environments.', 'AWS, Docker, Linux, CI/CD, Git', '₹6.0 - 8.0 LPA', 'Remote', CURDATE() - INTERVAL 6 DAY),
('Data Analyst Engineer', 'Quantum Metrics Inc', 'Delhi NCR, India', 'Analyze large datasets, develop insightful dashboards using PowerBI/Tableau, and write complex SQL queries to solve business problems.', 'Python, SQL, PowerBI, Excel, Data Modeling', '₹5.5 - 7.5 LPA', 'Hybrid', CURDATE() - INTERVAL 8 DAY),
('QA Automation Engineer', 'QualityFirst Labs', 'Chennai, India', 'Responsible for building test automation frameworks using Selenium and Java. Writing test cases, regression testing, and bug tracking.', 'Java, Selenium, TestNG, JIRA, SQL', '₹5.0 - 7.0 LPA', 'Full-time', CURDATE() - INTERVAL 10 DAY);

-- Insert Sample Internships
INSERT INTO internships (title, company, location, description, skills, stipend, duration, internship_type, posted_date) VALUES
('Frontend Web Development Intern', 'CodeCrafters Studio', 'Remote', 'Join our frontend team to build modern, responsive web user interfaces using React.js and CSS. You will convert design wireframes into clean, interactive web components.', 'React.js, JavaScript, CSS3, HTML5', '₹15,000 / month', '3 Months', 'Virtual/Remote', CURDATE() - INTERVAL 1 DAY),
('Backend Java Spring Boot Intern', 'Apex Software Labs', 'Bangalore, India', 'Great learning opportunity for B.Tech students! Work alongside senior software engineers building high-performance REST APIs, database schemas, and unit tests.', 'Java, Spring Boot, MySQL, REST APIs', '₹20,000 / month', '6 Months', 'Full-time', CURDATE() - INTERVAL 3 DAY),
('AI & Python Machine Learning Intern', 'Cognitive Minds Lab', 'Hyderabad, India', 'Assist in developing machine learning models, data preprocessing pipelines, and exploratory data analysis using Python, NumPy, and Pandas.', 'Python, Pandas, NumPy, Machine Learning', '₹18,000 / month', '3 Months', 'Hybrid', CURDATE() - INTERVAL 5 DAY),
('UI/UX Design & Research Intern', 'PixelCraft Agency', 'Mumbai, India', 'Conduct user research, design wireframes and high-fidelity mockups in Figma, and collaborate with developers to ensure pixel-perfect implementation.', 'Figma, Wireframing, Prototyping, UI/UX Design', '₹12,000 / month', '2 Months', 'Part-time', CURDATE() - INTERVAL 7 DAY);

-- Insert Sample Applications
INSERT INTO applications (student_id, job_id, internship_id, application_date, status) VALUES
(1, 1, NULL, CURDATE() - INTERVAL 1 DAY, 'SHORTLISTED'),
(1, NULL, 1, CURDATE() - INTERVAL 2 DAY, 'PENDING'),
(2, 4, NULL, CURDATE() - INTERVAL 3 DAY, 'ACCEPTED'),
(3, 2, NULL, CURDATE() - INTERVAL 2 DAY, 'PENDING');
