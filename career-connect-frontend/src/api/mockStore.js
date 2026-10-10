// ==========================================================
// Mock Database & Storage Engine for Offline / Demo Mode
// Seamlessly operates when Spring Boot backend is offline
// ==========================================================

const STORAGE_KEYS = {
  STUDENTS: 'portal_mock_students',
  JOBS: 'portal_mock_jobs',
  INTERNSHIPS: 'portal_mock_internships',
  APPLICATIONS: 'portal_mock_applications',
  ADMINS: 'portal_mock_admins',
  INIT: 'portal_mock_initialized_v2',
};

const initialStudents = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: 'password123',
    phone: '9876543210',
    skills: 'Java, Spring Boot, MySQL, React',
    qualification: 'B.Tech Computer Science (Final Year)',
    preferredLocation: 'Bangalore, Hyderabad',
    interests: 'Software Development, Backend Engineering',
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'password123',
    phone: '9812345678',
    skills: 'Python, Machine Learning, SQL',
    qualification: 'B.Tech Information Technology',
  },
  {
    id: 3,
    name: 'Amit Verma',
    email: 'amit@example.com',
    password: 'password123',
    phone: '9823456789',
    skills: 'React.js, JavaScript, Tailwind, Node.js',
    qualification: 'MCA / Computer Applications',
  },
];

const initialJobs = [
  {
    id: 1,
    title: 'Junior Java Developer',
    company: 'TechNova Solutions',
    location: 'Bangalore, India',
    description: 'We are looking for a passionate Junior Java Developer proficient in Core Java, Spring Boot, and REST APIs. You will work on designing scalable backend services, optimizing SQL queries, and collaborating with frontend teams.',
    skills: 'Java, Spring Boot, MySQL, REST APIs, Git',
    salary: '₹6.5 - 8.5 LPA',
    jobType: 'Full-time',
    postedDate: '2026-10-04',
  },
  {
    id: 2,
    title: 'Full Stack React & Node Developer',
    company: 'InnoWave Digital',
    location: 'Hyderabad, India',
    description: 'Exciting opportunity for a Full Stack Developer experienced with modern React.js, responsive web designs, RESTful microservices, and relational databases. Freshers with strong project portfolio welcome!',
    skills: 'React.js, Node.js, JavaScript, HTML5, CSS3, SQL',
    salary: '₹7.0 - 9.0 LPA',
    jobType: 'Full-time',
    postedDate: '2026-10-02',
  },
  {
    id: 3,
    title: 'Cloud & DevOps Associate',
    company: 'SkyNet Cloud Systems',
    location: 'Pune, India',
    description: 'Seeking a Cloud & DevOps engineer to manage CI/CD pipelines, Docker containers, AWS deployment, and Linux server environments.',
    skills: 'AWS, Docker, Linux, CI/CD, Git',
    salary: '₹6.0 - 8.0 LPA',
    jobType: 'Remote',
    postedDate: '2026-09-30',
  },
  {
    id: 4,
    title: 'Data Analyst Engineer',
    company: 'Quantum Metrics Inc',
    location: 'Delhi NCR, India',
    description: 'Analyze large datasets, develop insightful dashboards using PowerBI/Tableau, and write complex SQL queries to solve business problems.',
    skills: 'Python, SQL, PowerBI, Excel, Data Modeling',
    salary: '₹5.5 - 7.5 LPA',
    jobType: 'Hybrid',
    postedDate: '2026-09-28',
  },
  {
    id: 5,
    title: 'QA Automation Engineer',
    company: 'QualityFirst Labs',
    location: 'Chennai, India',
    description: 'Responsible for building test automation frameworks using Selenium and Java. Writing test cases, regression testing, and bug tracking.',
    skills: 'Java, Selenium, TestNG, JIRA, SQL',
    salary: '₹5.0 - 7.0 LPA',
    jobType: 'Full-time',
    postedDate: '2026-09-26',
  },
];

const initialInternships = [
  {
    id: 1,
    title: 'Frontend Web Development Intern',
    company: 'CodeCrafters Studio',
    location: 'Remote',
    description: 'Join our frontend team to build modern, responsive web user interfaces using React.js and CSS. You will convert design wireframes into clean, interactive web components.',
    skills: 'React.js, JavaScript, CSS3, HTML5',
    stipend: '₹15,000 / month',
    duration: '3 Months',
    internshipType: 'Virtual/Remote',
    postedDate: '2026-10-05',
  },
  {
    id: 2,
    title: 'Backend Java Spring Boot Intern',
    company: 'Apex Software Labs',
    location: 'Bangalore, India',
    description: 'Great learning opportunity for B.Tech students! Work alongside senior software engineers building high-performance REST APIs, database schemas, and unit tests.',
    skills: 'Java, Spring Boot, MySQL, REST APIs',
    stipend: '₹20,000 / month',
    duration: '6 Months',
    internshipType: 'Full-time',
    postedDate: '2026-10-03',
  },
  {
    id: 3,
    title: 'AI & Python Machine Learning Intern',
    company: 'Cognitive Minds Lab',
    location: 'Hyderabad, India',
    description: 'Assist in developing machine learning models, data preprocessing pipelines, and exploratory data analysis using Python, NumPy, and Pandas.',
    skills: 'Python, Pandas, NumPy, Machine Learning',
    stipend: '₹18,000 / month',
    duration: '3 Months',
    internshipType: 'Hybrid',
    postedDate: '2026-10-01',
  },
  {
    id: 4,
    title: 'UI/UX Design & Research Intern',
    company: 'PixelCraft Agency',
    location: 'Mumbai, India',
    description: 'Conduct user research, design wireframes and high-fidelity mockups in Figma, and collaborate with developers to ensure pixel-perfect implementation.',
    skills: 'Figma, Wireframing, Prototyping, UI/UX Design',
    stipend: '₹12,000 / month',
    duration: '2 Months',
    internshipType: 'Part-time',
    postedDate: '2026-09-29',
  },
];

const initialAdmins = [
  { id: 1, username: 'admin', password: 'admin123' },
];

const initialApplications = [
  {
    id: 1,
    student: initialStudents[0],
    job: initialJobs[0],
    internship: null,
    applicationDate: '2026-10-04',
    status: 'SHORTLISTED',
  },
  {
    id: 2,
    student: initialStudents[0],
    job: null,
    internship: initialInternships[0],
    applicationDate: '2026-10-05',
    status: 'PENDING',
  },
  {
    id: 3,
    student: initialStudents[1],
    job: initialJobs[3],
    internship: null,
    applicationDate: '2026-10-03',
    status: 'ACCEPTED',
  },
];

// Ensure mock tables are initialized in localStorage
function ensureInitialized() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.INIT)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialStudents));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(initialJobs));
    localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(initialInternships));
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(initialAdmins));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(initialApplications));
    localStorage.setItem(STORAGE_KEYS.INIT, 'true');
  }
}

// Helpers
function getList(key) {
  ensureInitialized();
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // fallback
    }
  }
  if (key === STORAGE_KEYS.STUDENTS) return [...initialStudents];
  if (key === STORAGE_KEYS.JOBS) return [...initialJobs];
  if (key === STORAGE_KEYS.INTERNSHIPS) return [...initialInternships];
  if (key === STORAGE_KEYS.ADMINS) return [...initialAdmins];
  if (key === STORAGE_KEYS.APPLICATIONS) return [...initialApplications];
  return [];
}

function saveList(key, list) {
  ensureInitialized();
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      // ignore
    }
  }
}

function createError(message, status = 400) {
  const err = new Error(message);
  err.response = {
    status,
    data: {
      success: false,
      message,
    },
  };
  return err;
}

// Mock Store API Implementation
export const mockStore = {
  // ---- STUDENT APIS ----
  registerStudent: async (studentData) => {
    ensureInitialized();
    const students = getList(STORAGE_KEYS.STUDENTS);
    const existing = students.find(
      (s) => s.email?.toLowerCase() === studentData.email?.toLowerCase()
    );
    if (existing) {
      throw createError(`Email is already registered: ${studentData.email}`);
    }

    const newStudent = {
      id: Date.now(),
      name: studentData.name,
      email: studentData.email,
      password: studentData.password,
      phone: studentData.phone || '',
      skills: studentData.skills || '',
      qualification: studentData.qualification || '',
    };
    students.push(newStudent);
    saveList(STORAGE_KEYS.STUDENTS, students);

    return {
      success: true,
      message: 'Student registered successfully! (Demo Mode)',
      data: newStudent,
    };
  },

  loginStudent: async (email, password) => {
    ensureInitialized();
    const students = getList(STORAGE_KEYS.STUDENTS);
    const student = students.find(
      (s) => s.email?.toLowerCase() === email?.toLowerCase()
    );

    if (!student) {
      throw createError('No account found with this email');
    }
    if (student.password !== password) {
      throw createError('Invalid password');
    }

    return {
      success: true,
      message: 'Login successful! (Demo Mode)',
      data: student,
    };
  },

  getStudentById: async (id) => {
    ensureInitialized();
    const students = getList(STORAGE_KEYS.STUDENTS);
    const s = students.find((st) => Number(st.id) === Number(id));
    if (!s) throw createError(`Student not found with ID: ${id}`, 404);
    return { success: true, data: s };
  },

  // ---- JOBS APIS ----
  getJobs: async (params = {}) => {
    ensureInitialized();
    let jobs = getList(STORAGE_KEYS.JOBS);

    if (params.keyword) {
      const q = params.keyword.toLowerCase().trim();
      jobs = jobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.company?.toLowerCase().includes(q) ||
          j.skills?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q)
      );
    }

    if (params.location) {
      const loc = params.location.toLowerCase().trim();
      jobs = jobs.filter((j) => j.location?.toLowerCase().includes(loc));
    }

    if (params.jobType) {
      const type = params.jobType.toLowerCase().trim();
      jobs = jobs.filter((j) => j.jobType?.toLowerCase() === type);
    }

    return { success: true, data: jobs };
  },

  getJobById: async (id) => {
    ensureInitialized();
    const jobs = getList(STORAGE_KEYS.JOBS);
    const j = jobs.find((item) => Number(item.id) === Number(id));
    if (!j) throw createError(`Job not found with ID: ${id}`, 404);
    return { success: true, data: j };
  },

  createJob: async (jobData) => {
    ensureInitialized();
    const jobs = getList(STORAGE_KEYS.JOBS);
    const newJob = {
      id: Date.now(),
      ...jobData,
      postedDate: new Date().toISOString().split('T')[0],
    };
    jobs.unshift(newJob);
    saveList(STORAGE_KEYS.JOBS, jobs);
    return { success: true, message: 'Job created successfully! (Demo Mode)', data: newJob };
  },

  updateJob: async (id, jobData) => {
    ensureInitialized();
    const jobs = getList(STORAGE_KEYS.JOBS);
    const idx = jobs.findIndex((j) => Number(j.id) === Number(id));
    if (idx === -1) throw createError(`Job not found with ID: ${id}`, 404);
    jobs[idx] = { ...jobs[idx], ...jobData };
    saveList(STORAGE_KEYS.JOBS, jobs);
    return { success: true, message: 'Job updated successfully! (Demo Mode)', data: jobs[idx] };
  },

  deleteJob: async (id) => {
    ensureInitialized();
    let jobs = getList(STORAGE_KEYS.JOBS);
    jobs = jobs.filter((j) => Number(j.id) !== Number(id));
    saveList(STORAGE_KEYS.JOBS, jobs);
    return { success: true, message: 'Job deleted successfully! (Demo Mode)' };
  },

  // ---- INTERNSHIPS APIS ----
  getInternships: async (params = {}) => {
    ensureInitialized();
    let internships = getList(STORAGE_KEYS.INTERNSHIPS);

    if (params.keyword) {
      const q = params.keyword.toLowerCase().trim();
      internships = internships.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.company?.toLowerCase().includes(q) ||
          i.skills?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      );
    }

    if (params.location) {
      const loc = params.location.toLowerCase().trim();
      internships = internships.filter((i) => i.location?.toLowerCase().includes(loc));
    }

    if (params.internshipType) {
      const type = params.internshipType.toLowerCase().trim();
      internships = internships.filter((i) => i.internshipType?.toLowerCase() === type);
    }

    return { success: true, data: internships };
  },

  getInternshipById: async (id) => {
    ensureInitialized();
    const internships = getList(STORAGE_KEYS.INTERNSHIPS);
    const item = internships.find((i) => Number(i.id) === Number(id));
    if (!item) throw createError(`Internship not found with ID: ${id}`, 404);
    return { success: true, data: item };
  },

  createInternship: async (internshipData) => {
    ensureInitialized();
    const internships = getList(STORAGE_KEYS.INTERNSHIPS);
    const newInternship = {
      id: Date.now(),
      ...internshipData,
      postedDate: new Date().toISOString().split('T')[0],
    };
    internships.unshift(newInternship);
    saveList(STORAGE_KEYS.INTERNSHIPS, internships);
    return { success: true, message: 'Internship created successfully! (Demo Mode)', data: newInternship };
  },

  updateInternship: async (id, internshipData) => {
    ensureInitialized();
    const internships = getList(STORAGE_KEYS.INTERNSHIPS);
    const idx = internships.findIndex((i) => Number(i.id) === Number(id));
    if (idx === -1) throw createError(`Internship not found with ID: ${id}`, 404);
    internships[idx] = { ...internships[idx], ...internshipData };
    saveList(STORAGE_KEYS.INTERNSHIPS, internships);
    return { success: true, message: 'Internship updated successfully! (Demo Mode)', data: internships[idx] };
  },

  deleteInternship: async (id) => {
    ensureInitialized();
    let internships = getList(STORAGE_KEYS.INTERNSHIPS);
    internships = internships.filter((i) => Number(i.id) !== Number(id));
    saveList(STORAGE_KEYS.INTERNSHIPS, internships);
    return { success: true, message: 'Internship deleted successfully! (Demo Mode)' };
  },

  // ---- APPLICATIONS APIS ----
  apply: async ({ studentId, jobId, internshipId }) => {
    ensureInitialized();
    const applications = getList(STORAGE_KEYS.APPLICATIONS);
    const students = getList(STORAGE_KEYS.STUDENTS);
    const jobs = getList(STORAGE_KEYS.JOBS);
    const internships = getList(STORAGE_KEYS.INTERNSHIPS);

    const student = students.find((s) => Number(s.id) === Number(studentId));
    if (!student) throw createError('Student profile not found');

    let job = null;
    let internship = null;

    if (jobId) {
      job = jobs.find((j) => Number(j.id) === Number(jobId)) || null;
      const already = applications.some(
        (a) => Number(a.student?.id) === Number(studentId) && Number(a.job?.id) === Number(jobId)
      );
      if (already) throw createError('You have already applied for this job!');
    }

    if (internshipId) {
      internship = internships.find((i) => Number(i.id) === Number(internshipId)) || null;
      const already = applications.some(
        (a) => Number(a.student?.id) === Number(studentId) && Number(a.internship?.id) === Number(internshipId)
      );
      if (already) throw createError('You have already applied for this internship!');
    }

    const newApp = {
      id: Date.now(),
      student,
      job,
      internship,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };

    applications.unshift(newApp);
    saveList(STORAGE_KEYS.APPLICATIONS, applications);
    return { success: true, message: 'Application submitted successfully! (Demo Mode)', data: newApp };
  },

  getApplicationsByStudent: async (studentId) => {
    ensureInitialized();
    const apps = getList(STORAGE_KEYS.APPLICATIONS);
    const studentApps = apps.filter((a) => Number(a.student?.id) === Number(studentId));
    return { success: true, data: studentApps };
  },

  getApplicationsByJob: async (jobId) => {
    ensureInitialized();
    const apps = getList(STORAGE_KEYS.APPLICATIONS);
    const jobApps = apps.filter((a) => Number(a.job?.id) === Number(jobId));
    return { success: true, data: jobApps };
  },

  getApplicationsByInternship: async (internshipId) => {
    ensureInitialized();
    const apps = getList(STORAGE_KEYS.APPLICATIONS);
    const internApps = apps.filter((a) => Number(a.internship?.id) === Number(internshipId));
    return { success: true, data: internApps };
  },

  getAllApplications: async () => {
    ensureInitialized();
    const apps = getList(STORAGE_KEYS.APPLICATIONS);
    return { success: true, data: apps };
  },

  updateApplicationStatus: async (id, status) => {
    ensureInitialized();
    const apps = getList(STORAGE_KEYS.APPLICATIONS);
    const idx = apps.findIndex((a) => Number(a.id) === Number(id));
    if (idx === -1) throw createError(`Application not found with ID: ${id}`, 404);
    apps[idx].status = status;
    saveList(STORAGE_KEYS.APPLICATIONS, apps);
    return { success: true, message: 'Status updated successfully! (Demo Mode)', data: apps[idx] };
  },

  // ---- ADMIN APIS ----
  loginAdmin: async (username, password) => {
    ensureInitialized();
    const admins = getList(STORAGE_KEYS.ADMINS);
    const admin = admins.find((a) => a.username === username);
    if (!admin || admin.password !== password) {
      throw createError('Invalid admin credentials. Use admin / admin123');
    }
    return {
      success: true,
      message: 'Admin authentication verified! (Demo Mode)',
      data: { id: admin.id, username: admin.username },
    };
  },

  getAdminStats: async () => {
    ensureInitialized();
    const students = getList(STORAGE_KEYS.STUDENTS);
    const jobs = getList(STORAGE_KEYS.JOBS);
    const internships = getList(STORAGE_KEYS.INTERNSHIPS);
    const apps = getList(STORAGE_KEYS.APPLICATIONS);

    return {
      success: true,
      data: {
        totalStudents: students.length,
        totalJobs: jobs.length,
        totalInternships: internships.length,
        totalApplications: apps.length,
        pendingApplications: apps.filter((a) => a.status === 'PENDING').length,
        shortlistedApplications: apps.filter((a) => a.status === 'SHORTLISTED').length,
        acceptedApplications: apps.filter((a) => a.status === 'ACCEPTED').length,
        rejectedApplications: apps.filter((a) => a.status === 'REJECTED').length,
      },
    };
  },

  // ---- AI RECOMMENDATION APIS ----
  getRecommendationsForStudent: async (studentId) => {
    ensureInitialized();
    const students = getList(STORAGE_KEYS.STUDENTS);
    const student = students.find((s) => s.id === Number(studentId));
    if (!student) {
      throw createError(`Student not found with ID ${studentId}`);
    }

    const jobs = getList(STORAGE_KEYS.JOBS);
    const internships = getList(STORAGE_KEYS.INTERNSHIPS);
    const result = computeAiRecommendations(student, jobs, internships);

    return {
      success: true,
      message: 'AI recommendations generated successfully',
      data: result,
    };
  },

  getGuestRecommendations: async (params = {}) => {
    ensureInitialized();
    const guestStudent = {
      id: null,
      name: 'Guest Explorer',
      skills: params.skills || 'Java, Spring Boot, React, MySQL',
      qualification: params.qualification || 'B.Tech Computer Science',
      preferredLocation: params.location || 'Bangalore, India',
      interests: params.interests || 'Software Engineering',
    };

    const jobs = getList(STORAGE_KEYS.JOBS);
    const internships = getList(STORAGE_KEYS.INTERNSHIPS);
    const result = computeAiRecommendations(guestStudent, jobs, internships);

    return {
      success: true,
      message: 'AI recommendations generated successfully',
      data: result,
    };
  },

  updateStudent: async (id, updatedData) => {
    ensureInitialized();
    const students = getList(STORAGE_KEYS.STUDENTS);
    const idx = students.findIndex((s) => s.id === Number(id));
    if (idx === -1) throw createError(`Student not found with ID ${id}`);
    students[idx] = { ...students[idx], ...updatedData };
    saveList(STORAGE_KEYS.STUDENTS, students);
    return {
      success: true,
      message: 'Student profile updated successfully!',
      data: students[idx],
    };
  },
};

// ==========================================================
// AI Recommendation Scoring Engine for Frontend Demo Mode
// ==========================================================
function computeAiRecommendations(student, jobs, internships) {
  const parseSkillsList = (str) => {
    if (!str) return [];
    return str.split(/[,;•|\n]+/).map((s) => s.trim()).filter(Boolean);
  };

  const normalizeSkill = (s) => {
    if (!s) return '';
    return s.toLowerCase().replace(/\.js$/i, '').replace(/[^a-z0-9+#]/g, '').trim();
  };

  const studentSkillsList = parseSkillsList(student.skills);
  const normalizedStudentSkills = new Set(studentSkillsList.map(normalizeSkill));

  const isMatched = (reqSkill) => {
    const norm = normalizeSkill(reqSkill);
    if (normalizedStudentSkills.has(norm)) return true;
    for (const s of normalizedStudentSkills) {
      if (s === norm || s.includes(norm) || norm.includes(s)) {
        if (Math.abs(s.length - norm.length) <= 4) return true;
      }
      if (
        (s.includes('react') && norm.includes('react')) ||
        (s.includes('spring') && norm.includes('spring')) ||
        (s.includes('node') && norm.includes('node')) ||
        (s.includes('sql') && norm.includes('sql')) ||
        (s.includes('python') && norm.includes('python')) ||
        ((s.includes('ml') || s.includes('machine')) && (norm.includes('ml') || norm.includes('machine'))) ||
        (s.includes('api') && norm.includes('api')) ||
        (s.includes('aws') && norm.includes('cloud')) ||
        ((s.includes('figma') || s.includes('ui')) && (norm.includes('figma') || norm.includes('ui')))
      ) {
        return true;
      }
    }
    return false;
  };

  const evaluate = (item, type) => {
    const requiredSkillsList = parseSkillsList(item.skills);
    const matchedSkills = [];
    const missingSkills = [];

    requiredSkillsList.forEach((req) => {
      if (isMatched(req)) {
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    });

    const totalRequired = requiredSkillsList.length;
    const skillPercent = totalRequired > 0 ? (matchedSkills.length / totalRequired) * 100 : 50;

    let baseScore = skillPercent * 0.8;

    let titleBonus = 0;
    const titleLower = (item.title || '').toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    const interestsLower = (student.interests || '').toLowerCase();

    for (const s of normalizedStudentSkills) {
      if (titleLower.includes(s)) {
        titleBonus += 5;
        break;
      }
    }
    if (interestsLower && (titleLower.includes(interestsLower) || descLower.includes(interestsLower))) {
      titleBonus += 4;
    }
    for (const s of normalizedStudentSkills) {
      if (descLower.includes(s)) {
        titleBonus += 3;
        break;
      }
    }
    titleBonus = Math.min(10, titleBonus);

    let locQualBonus = 4;
    const locLower = (item.location || '').toLowerCase();
    const prefLocLower = (student.preferredLocation || '').toLowerCase();
    if (locLower.includes('remote') || !prefLocLower || locLower.includes(prefLocLower)) {
      locQualBonus += 4;
    }
    const qualLower = (student.qualification || '').toLowerCase();
    if (qualLower.includes('b.tech') || qualLower.includes('cs') || qualLower.includes('it') || qualLower.includes('mca')) {
      locQualBonus += 2;
    }
    locQualBonus = Math.min(10, locQualBonus);

    let matchScore = Math.round(baseScore + titleBonus + locQualBonus);
    if (matchedSkills.length === totalRequired && totalRequired > 0) {
      matchScore = Math.max(matchScore, 95);
    } else if (matchedSkills.length >= 3 && totalRequired - matchedSkills.length <= 1) {
      matchScore = Math.max(matchScore, 88);
    }
    matchScore = Math.max(10, Math.min(100, matchScore));

    let reason = '';
    if (matchedSkills.length > 0) {
      let joined = '';
      if (matchedSkills.length <= 2) {
        joined = matchedSkills.join(' and ');
      } else {
        const last = matchedSkills[matchedSkills.length - 1];
        joined = matchedSkills.slice(0, -1).join(', ') + ' and ' + last;
      }

      if (matchScore >= 75) {
        reason = `Your ${joined} skills strongly match the requirements of this position.`;
      } else if (matchScore >= 55) {
        reason = `Your ${joined} skills align with this position. Acquiring ${missingSkills[0] || 'additional skills'} will give you an edge.`;
      } else {
        reason = `Your ${joined} knowledge provides a good foundation for this position.`;
      }
    } else {
      reason = `Recommended as an entry opportunity for ${item.title} to broaden your portfolio.`;
    }

    return {
      id: item.id,
      opportunityId: item.id,
      title: item.title,
      company: item.company,
      type,
      location: item.location,
      matchScore,
      matchedSkills,
      missingSkills,
      requiredSkills: requiredSkillsList,
      reason,
      salaryOrStipend: item.salary || item.stipend || '',
      opportunityType: item.jobType || item.internshipType || '',
      duration: item.duration || '',
      description: item.description,
    };
  };

  const jobRecs = jobs.map((j) => evaluate(j, 'Job'));
  const internRecs = internships.map((i) => evaluate(i, 'Internship'));
  const allRecs = [...jobRecs, ...internRecs];

  allRecs.sort((a, b) => b.matchScore - a.matchScore);

  const missingFreq = {};
  allRecs.slice(0, 8).forEach((r) => {
    r.missingSkills.forEach((m) => {
      const clean = m.trim();
      missingFreq[clean] = (missingFreq[clean] || 0) + 1;
    });
  });

  let topRecommendedSkills = Object.entries(missingFreq)
    .sort((a, b) => b[1] - a[1])
    .map((e) => e[0])
    .slice(0, 4);

  if (topRecommendedSkills.length === 0 && studentSkillsList.length > 0) {
    topRecommendedSkills = ['Docker', 'AWS', 'Microservices'];
  }

  const topMatches = allRecs.slice(0, 4);
  const currentMatchScore =
    topMatches.length > 0
      ? Math.round(topMatches.reduce((acc, curr) => acc + curr.matchScore, 0) / topMatches.length)
      : 0;

  return {
    studentId: student.id,
    studentName: student.name,
    studentSkills: studentSkillsList,
    qualification: student.qualification,
    preferredLocation: student.preferredLocation,
    currentMatchScore,
    recommendedSkills: topRecommendedSkills,
    recommendations: allRecs,
  };
}
