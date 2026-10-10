import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, ArrowLeft } from 'lucide-react';
import { adminApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import AlertNotification from '../components/AlertNotification';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fillDemoAdmin = () => {
    setFormData({
      username: 'admin',
      password: 'admin123',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setAlert({ type: 'error', message: 'Please enter admin username and password' });
      return;
    }

    setLoading(true);
    try {
      const response = await adminApi.login(formData);
      if (response.data.success) {
        loginAdmin(response.data.data);
        setAlert({ type: 'success', message: 'Admin authentication verified! Redirecting...' });
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 800);
      } else {
        setAlert({ type: 'error', message: response.data.message || 'Authentication failed' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to authenticate admin';
      setAlert({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '460px', margin: '3.5rem auto' }}>
      {alert && (
        <AlertNotification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="card" style={{ padding: '2.5rem', border: '1px solid #cbd5e1' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            className="brand-icon-box"
            style={{ margin: '0 auto 1rem', width: '48px', height: '48px', background: 'linear-gradient(135deg, #0f172a, #334155)' }}
          >
            <ShieldCheck size={26} color="#38bdf8" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Admin Portal Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Authorized university placement officers & recruitment admins only
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={15} /> Username
            </label>
            <input
              type="text"
              name="username"
              required
              className="form-control"
              placeholder="e.g. admin"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={15} /> Admin Password
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
            style={{ width: '100%', marginTop: '0.5rem', background: '#0f172a' }}
            disabled={loading}
          >
            <ShieldCheck size={16} /> {loading ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>

          <button
            type="button"
            onClick={fillDemoAdmin}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginTop: '0.8rem', fontSize: '0.82rem' }}
          >
            ⚡ Auto-Fill Demo Admin (admin / admin123)
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <Link to="/student/login" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} /> Back to Student Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
