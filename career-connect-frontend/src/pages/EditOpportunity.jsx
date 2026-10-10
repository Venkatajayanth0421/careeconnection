import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Edit2, ArrowLeft, Save } from 'lucide-react';
import { jobApi, internshipApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import AlertNotification from '../components/AlertNotification';

const EditOpportunity = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticatedAdmin } = useAuth();

  const isJob = location.pathname.includes('/edit-job/');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    skills: '',
    salary: '',
    jobType: 'Full-time',
    stipend: '',
    duration: '',
    internshipType: 'Virtual/Remote',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!isAuthenticatedAdmin) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [id, isJob]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isJob) {
        const res = await jobApi.getById(id);
        const data = res.data.data;
        setFormData({
          title: data.title || '',
          company: data.company || '',
          location: data.location || '',
          description: data.description || '',
          skills: data.skills || '',
          salary: data.salary || '',
          jobType: data.jobType || 'Full-time',
          stipend: '',
          duration: '',
          internshipType: '',
        });
      } else {
        const res = await internshipApi.getById(id);
        const data = res.data.data;
        setFormData({
          title: data.title || '',
          company: data.company || '',
          location: data.location || '',
          description: data.description || '',
          skills: data.skills || '',
          salary: '',
          jobType: '',
          stipend: data.stipend || '',
          duration: data.duration || '',
          internshipType: data.internshipType || 'Virtual/Remote',
        });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to fetch existing data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isJob) {
        await jobApi.update(id, {
          title: formData.title,
          company: formData.company,
          location: formData.location,
          description: formData.description,
          skills: formData.skills,
          salary: formData.salary,
          jobType: formData.jobType,
        });
        setAlert({ type: 'success', message: 'Job updated successfully!' });
      } else {
        await internshipApi.update(id, {
          title: formData.title,
          company: formData.company,
          location: formData.location,
          description: formData.description,
          skills: formData.skills,
          stipend: formData.stipend,
          duration: formData.duration,
          internshipType: formData.internshipType,
        });
        setAlert({ type: 'success', message: 'Internship updated successfully!' });
      }

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to save changes' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ margin: '4rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading opportunity data...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '750px', margin: '2.5rem auto' }}>
      {alert && (
        <AlertNotification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Admin Dashboard
      </Link>

      <div className="card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' }}>
          Edit {isJob ? 'Job' : 'Internship'} #{id}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '2rem' }}>
          Update the posting information, requirements, or stipend/package
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Position Title *</label>
              <input
                type="text"
                name="title"
                required
                className="form-control"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                name="company"
                required
                className="form-control"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                name="location"
                required
                className="form-control"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {isJob ? (
              <div className="form-group">
                <label className="form-label">Salary / Package</label>
                <input
                  type="text"
                  name="salary"
                  className="form-control"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Monthly Stipend</label>
                <input
                  type="text"
                  name="stipend"
                  className="form-control"
                  value={formData.stipend}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className="form-row">
            {isJob ? (
              <div className="form-group">
                <label className="form-label">Job Work Type</label>
                <select
                  name="jobType"
                  className="form-control"
                  value={formData.jobType}
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    className="form-control"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Internship Mode</label>
                  <select
                    name="internshipType"
                    className="form-control"
                    value={formData.internshipType}
                    onChange={handleChange}
                  >
                    <option value="Virtual/Remote">Virtual / Remote</option>
                    <option value="Full-time">On-site Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Technical Skills (Comma separated)</label>
            <input
              type="text"
              name="skills"
              className="form-control"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              rows={5}
              className="form-control"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
            disabled={saving}
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Update Posting'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditOpportunity;
