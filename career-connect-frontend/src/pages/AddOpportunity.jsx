import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Briefcase, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Clock, 
  FileText, 
  Wrench, 
  ArrowLeft 
} from 'lucide-react';
import { jobApi, internshipApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import AlertNotification from '../components/AlertNotification';

const AddOpportunity = () => {
  const [searchParams] = useSearchParams();
  const defaultCategory = searchParams.get('type') === 'internship' ? 'internship' : 'job';
  const [category, setCategory] = useState(defaultCategory);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    skills: '',
    salary: '',
    jobType: 'Full-time',
    stipend: '',
    duration: '3 Months',
    internshipType: 'Virtual/Remote',
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { isAuthenticatedAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.location) {
      setAlert({ type: 'error', message: 'Title, Company, and Location are required.' });
      return;
    }

    setLoading(true);
    try {
      if (category === 'job') {
        const payload = {
          title: formData.title,
          company: formData.company,
          location: formData.location,
          description: formData.description,
          skills: formData.skills,
          salary: formData.salary,
          jobType: formData.jobType,
        };
        await jobApi.create(payload);
        setAlert({ type: 'success', message: 'New Job posted successfully! Redirecting...' });
      } else {
        const payload = {
          title: formData.title,
          company: formData.company,
          location: formData.location,
          description: formData.description,
          skills: formData.skills,
          stipend: formData.stipend,
          duration: formData.duration,
          internshipType: formData.internshipType,
        };
        await internshipApi.create(payload);
        setAlert({ type: 'success', message: 'New Internship posted successfully! Redirecting...' });
      }

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to post opportunity';
      setAlert({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '780px', margin: '2.5rem auto' }}>
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Create New Placement Opportunity</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Publish a verified position for registered university students
          </p>
        </div>

        {/* Opportunity Type Toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <button
            type="button"
            onClick={() => setCategory('job')}
            className={`btn ${category === 'job' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.85rem' }}
          >
            <Briefcase size={18} /> Post Full-Time Job
          </button>
          <button
            type="button"
            onClick={() => setCategory('internship')}
            className={`btn ${category === 'internship' ? 'btn-secondary' : 'btn-outline'}`}
            style={{ padding: '0.85rem' }}
          >
            <Building2 size={18} /> Post Student Internship
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Position / Role Title *</label>
              <input
                type="text"
                name="title"
                required
                className="form-control"
                placeholder={category === 'job' ? 'e.g. Associate Software Engineer' : 'e.g. Frontend Development Intern'}
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
                placeholder="e.g. Infosys, TCS, TechNova Labs"
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
                placeholder="e.g. Bangalore, Hyderabad, Remote, Hybrid"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {category === 'job' ? (
              <div className="form-group">
                <label className="form-label">Annual Salary Package</label>
                <input
                  type="text"
                  name="salary"
                  className="form-control"
                  placeholder="e.g. ₹6.5 - 8.5 LPA"
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
                  placeholder="e.g. ₹15,000 / month"
                  value={formData.stipend}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className="form-row">
            {category === 'job' ? (
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
                  <label className="form-label">Internship Duration</label>
                  <input
                    type="text"
                    name="duration"
                    className="form-control"
                    placeholder="e.g. 3 Months, 6 Months"
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
            <label className="form-label">Required Technical Skills (Comma separated)</label>
            <input
              type="text"
              name="skills"
              className="form-control"
              placeholder="e.g. Java, Spring Boot, MySQL, REST APIs"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Job Description & Requirements</label>
            <textarea
              name="description"
              rows={5}
              className="form-control"
              placeholder="Describe candidate responsibilities, eligibility, tech stack, and selection process..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
            disabled={loading}
          >
            <PlusCircle size={18} /> {loading ? 'Publishing...' : `Publish ${category === 'job' ? 'Job' : 'Internship'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOpportunity;
