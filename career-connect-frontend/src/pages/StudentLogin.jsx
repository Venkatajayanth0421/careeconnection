import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, GraduationCap, ArrowRight } from 'lucide-react';
import { studentApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import AlertNotification from '../components/AlertNotification';

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { loginStudent } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fillDemoStudent = () => {
    setFormData({
      email: 'rahul@example.com',
      password: 'password123',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setAlert({ type: 'error', message: 'Please enter both email and password' });
      return;
    }

    setLoading(true);
    try {
      const response = await studentApi.login(formData);
      if (response.data.success) {
        loginStudent(response.data.data);
        setAlert({ type: 'success', message: 'Login successful! Redirecting...' });
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 800);
      } else {
        setAlert({ type: 'error', message: response.data.message || 'Login failed' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to connect to backend';
      setAlert({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px', margin: '3.5rem auto' }}>
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
            <GraduationCap size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Student Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Access your job applications and explore new opportunities
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={15} /> Registered Email
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

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={15} /> Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            <LogIn size={16} /> {loading ? 'Signing In...' : 'Sign In as Student'}
          </button>

          <button
            type="button"
            onClick={fillDemoStudent}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginTop: '0.8rem', fontSize: '0.82rem' }}
          >
            ⚡ Auto-Fill Demo Student (rahul@example.com)
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/student/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Register here
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.82rem' }}>
          <Link to="/admin/login" style={{ color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Are you an administrator? Admin Login <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
