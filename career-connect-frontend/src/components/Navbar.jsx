import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  GraduationCap, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Menu, 
  X,
  PlusCircle,
  Activity
} from 'lucide-react';
import { getBackendStatus, checkBackendHealth } from '../api/api';

const Navbar = () => {
  const { student, admin, logoutStudent, logoutAdmin, isAuthenticatedStudent, isAuthenticatedAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(getBackendStatus());
  const navigate = useNavigate();

  useEffect(() => {
    checkBackendHealth().then((status) => setIsBackendOnline(status));

    const handleStatusChange = (e) => {
      setIsBackendOnline(e.detail.isOnline);
    };

    window.addEventListener('backend-status-change', handleStatusChange);
    return () => window.removeEventListener('backend-status-change', handleStatusChange);
  }, []);

  const handleStudentLogout = () => {
    logoutStudent();
    navigate('/student/login');
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="brand-icon-box">
              <GraduationCap size={22} />
            </div>
            <span>JobPortal<span style={{ color: 'var(--secondary)' }}>.Hub</span></span>
          </Link>
          {isBackendOnline === false && (
            <span
              className="badge"
              style={{
                background: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fcd34d',
                fontSize: '0.72rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                cursor: 'help'
              }}
              title="Spring Boot backend is offline on port 8080. Local interactive engine active: full search, registration, login, and application tracker are active!"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
              Demo Engine
            </span>
          )}
          {isBackendOnline === true && (
            <span
              className="badge"
              style={{
                background: '#dcfce7',
                color: '#166534',
                border: '1px solid #86efac',
                fontSize: '0.72rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
              }}
              title="Connected live to Spring Boot REST API on port 8080"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
              Live Backend
            </span>
          )}
        </div>

        {/* Desktop & Mobile Navigation Links */}
        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              Browse Jobs
            </NavLink>
          </li>
          <li>
            <NavLink to="/internships" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
              Internships
            </NavLink>
          </li>

          {/* Student Links */}
          {isAuthenticatedStudent && (
            <>
              <li>
                <NavLink to="/student/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard size={16} style={{ display: 'inline', marginRight: '4px' }} />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-applications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <FileText size={16} style={{ display: 'inline', marginRight: '4px' }} />
                  My Applications
                </NavLink>
              </li>
            </>
          )}

          {/* Admin Links */}
          {isAuthenticatedAdmin && (
            <>
              <li>
                <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <ShieldCheck size={16} style={{ display: 'inline', marginRight: '4px' }} />
                  Admin Panel
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/add-opportunity" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <PlusCircle size={16} style={{ display: 'inline', marginRight: '4px' }} />
                  Post Job/Internship
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Action Buttons */}
        <div className="nav-actions">
          {isAuthenticatedStudent ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <GraduationCap size={14} /> {student.name ? student.name.split(' ')[0] : 'Student'}
              </span>
              <button onClick={handleStudentLogout} className="btn btn-outline btn-sm" title="Logout">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : isAuthenticatedAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Admin ({admin.username})
              </span>
              <button onClick={handleAdminLogout} className="btn btn-outline btn-sm" title="Logout Admin">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/student/login" className="btn btn-outline btn-sm">
                <LogIn size={15} /> Student Login
              </Link>
              <Link to="/student/register" className="btn btn-primary btn-sm">
                <UserPlus size={15} /> Register
              </Link>
              <Link to="/admin/login" className="btn btn-secondary btn-sm" title="Admin Portal">
                <ShieldCheck size={15} /> Admin
              </Link>
            </div>
          )}

          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
