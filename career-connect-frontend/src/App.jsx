import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import StudentDashboard from './pages/StudentDashboard';
import JobsList from './pages/JobsList';
import JobDetails from './pages/JobDetails';
import InternshipsList from './pages/InternshipsList';
import InternshipDetails from './pages/InternshipDetails';
import MyApplications from './pages/MyApplications';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddOpportunity from './pages/AddOpportunity';
import EditOpportunity from './pages/EditOpportunity';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/internships" element={<InternshipsList />} />
            <Route path="/internships/:id" element={<InternshipDetails />} />

            {/* Student Auth & Portal */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/my-applications" element={<MyApplications />} />

            {/* Admin Auth & Portal */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-opportunity" element={<AddOpportunity />} />
            <Route path="/admin/edit-job/:id" element={<EditOpportunity />} />
            <Route path="/admin/edit-internship/:id" element={<EditOpportunity />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
