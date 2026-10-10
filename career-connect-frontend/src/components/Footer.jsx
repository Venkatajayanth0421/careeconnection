import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div style={{ maxWidth: '360px' }}>
            <div className="brand-logo" style={{ marginBottom: '0.8rem' }}>
              <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
                <GraduationCap size={18} />
              </div>
              <span style={{ fontSize: '1.1rem' }}>Job & Internship Portal</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              A modern B.Tech full-stack recruitment portal connecting engineering students with exciting corporate careers and industrial internships.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><Link to="/jobs" style={{ hover: { color: 'var(--primary)' } }}>Full-Time Jobs</Link></li>
              <li><Link to="/internships">Summer & Industrial Internships</Link></li>
              <li><Link to="/student/login">Student Sign In</Link></li>
              <li><Link to="/student/register">Create Free Student Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>Tech Stack</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxWidth: '240px' }}>
              <span className="badge badge-gray">React.js</span>
              <span className="badge badge-gray">Spring Boot</span>
              <span className="badge badge-gray">MySQL</span>
              <span className="badge badge-gray">REST APIs</span>
              <span className="badge badge-gray">Spring Data JPA</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Job & Internship Portal — Built for College B.Tech Final Project with Spring Boot & React.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
