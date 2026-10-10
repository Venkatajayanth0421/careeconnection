import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  ArrowLeft, 
  CheckCircle2, 
  Send,
  Building,
  Edit2,
  Trash2
} from 'lucide-react';
import { jobApi, applicationApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import AlertNotification from '../components/AlertNotification';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student, isAuthenticatedStudent, isAuthenticatedAdmin } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await jobApi.getById(id);
      setJob(res.data.data);

      // Check if student already applied
      if (student?.id) {
        try {
          const appRes = await applicationApi.getByStudent(student.id);
          const already = (appRes.data.data || []).some((a) => a.job && a.job.id === Number(id));
          setHasApplied(already);
        } catch (e) {
          console.log('Could not check application status', e);
        }
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load job details.' });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticatedStudent) {
      setAlert({ type: 'info', message: 'Please login as student to submit application.' });
      setTimeout(() => navigate('/student/login'), 1200);
      return;
    }

    setApplying(true);
    try {
      const res = await applicationApi.apply({
        studentId: student.id,
        jobId: Number(id),
      });

      if (res.data.success) {
        setHasApplied(true);
        setAlert({
          type: 'success',
          message: 'Your application has been successfully submitted! Check My Applications for updates.',
        });
      } else {
        setAlert({ type: 'error', message: res.data.message || 'Application failed' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit application';
      setAlert({ type: 'error', message: msg });
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete job "${job?.title}"?`)) return;
    try {
      await jobApi.delete(id);
      navigate('/jobs');
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to delete job' });
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ margin: '4rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container" style={{ margin: '4rem auto', textAlign: 'center' }}>
        <h2>Job Not Found</h2>
        <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Jobs List
        </Link>
      </div>
    );
  }

  const skillsList = job.skills
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="container" style={{ maxWidth: '850px', margin: '2.5rem auto' }}>
      {alert && (
        <AlertNotification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Back button */}
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to All Jobs
      </Link>

      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>{job.jobType || 'Full-time'}</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{job.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.3rem' }}>
              <Building size={18} />
              <span>{job.company}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isAuthenticatedAdmin && (
              <>
                <Link to={`/admin/edit-job/${job.id}`} className="btn btn-secondary btn-sm">
                  <Edit2 size={15} /> Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-danger btn-sm">
                  <Trash2 size={15} /> Delete
                </button>
              </>
            )}

            {!isAuthenticatedAdmin && (
              hasApplied ? (
                <span className="badge badge-success" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={16} /> Applied
                </span>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.6rem' }}
                >
                  <Send size={16} /> {applying ? 'Submitting...' : 'Apply for this Job'}
                </button>
              )
            )}
          </div>
        </div>

        {/* Quick Meta Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>LOCATION</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <MapPin size={16} color="var(--primary)" /> {job.location}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>OFFERED PACKAGE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <IndianRupee size={16} color="var(--accent)" /> {job.salary || 'Best in Industry'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>POSTED ON</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <Calendar size={16} color="var(--secondary-hover)" /> {job.postedDate || 'Recently'}
            </div>
          </div>
        </div>

        {/* Required Skills */}
        {skillsList.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Key Technical Skills Required</h3>
            <div className="skills-tags">
              {skillsList.map((skill, index) => (
                <span key={index} className="skill-tag" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full Job Description */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Role Description & Responsibilities</h3>
          <div style={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: '#334155', fontSize: '0.96rem' }}>
            {job.description}
          </div>
        </div>

        {/* Bottom Apply Card */}
        {!isAuthenticatedAdmin && (
          <div style={{ background: 'var(--primary-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ color: 'var(--primary)', fontWeight: 800 }}>Interested in this position?</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                {hasApplied ? 'You have already submitted an application for this role.' : 'Submit your student profile with one click.'}
              </p>
            </div>
            {hasApplied ? (
              <span className="badge badge-success" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} /> Application Under Review
              </span>
            ) : (
              <button onClick={handleApply} disabled={applying} className="btn btn-primary">
                <Send size={15} /> {applying ? 'Submitting...' : 'Apply Now'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
