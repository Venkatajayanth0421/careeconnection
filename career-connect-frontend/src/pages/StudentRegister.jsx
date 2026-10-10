import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Phone, Wrench, GraduationCap, CheckCircle } from 'lucide-react';
import { studentApi } from '../api/api';
import AlertNotification from '../components/AlertNotification';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    skills: '',
    qualification: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setAlert({ type: 'error', message: 'Name, Email, and Password are mandatory fields.' });
      return;
    }

    setLoading(true);
    try {
      const response = await studentApi.register(formData);
      if (response.data.success) {
        setAlert({
          type: 'success',
          message: 'Account registered successfully! Redirecting to login...',
        });
        setTimeout(() => {
          navigate('/student/login');
        }, 1500);
      } else {
        setAlert({ type: 'error', message: response.data.message || 'Registration failed' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to connect to backend';
      setAlert({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '640px', margin: '3rem auto' }}>
      {alert && (
        <AlertNotification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            className="brand-icon-box"
            style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}
          >
            <UserPlus size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Student Registration</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Build your campus placement profile to apply for premier jobs and internships
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={15} /> Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="form-control"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={15} /> Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                className="form-control"
                placeholder="e.g. rahul@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Lock size={15} /> Password *
              </label>
              <input
                type="password"
                name="password"
                required
                className="form-control"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={15} /> Contact Number
              </label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <GraduationCap size={15} /> Academic Qualification
            </label>
            <input
              type="text"
              name="qualification"
              className="form-control"
              placeholder="e.g. B.Tech Computer Science (3rd / 4th Year) or MCA"
              value={formData.qualification}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Wrench size={15} /> Technical Skills (Comma separated)
            </label>
            <input
              type="text"
              name="skills"
              className="form-control"
              placeholder="e.g. Java, Spring Boot, React, MySQL, Python"
              value={formData.skills}
              onChange={handleChange}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '2px' }}>
              These skills will match with recruiter postings for best recommendations.
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            <UserPlus size={16} /> {loading ? 'Registering...' : 'Create Student Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/student/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
