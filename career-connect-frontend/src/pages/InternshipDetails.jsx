import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  CheckCircle2, 
  Send,
  Edit2,
  Trash2
} from 'lucide-react';
import { internshipApi, applicationApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import AlertNotification from '../components/AlertNotification';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student, isAuthenticatedStudent, isAuthenticatedAdmin } = useAuth();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchInternshipDetails();
  }, [id]);

  const fetchInternshipDetails = async () => {
    setLoading(true);
    try {
      const res = await internshipApi.getById(id);
      setInternship(res.data.data);

      if (student?.id) {
        try {
          const appRes = await applicationApi.getByStudent(student.id);
          const already = (appRes.data.data || []).some((a) => a.internship && a.internship.id === Number(id));
          setHasApplied(already);
        } catch (e) {
          console.log('Could not check application status', e);
        }
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load internship details.' });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticatedStudent) {
      setAlert({ type: 'info', message: 'Please login as student to apply for internship.' });
      setTimeout(() => navigate('/student/login'), 1200);
      return;
    }

    setApplying(true);
    try {
      const res = await applicationApi.apply({
        studentId: student.id,
        internshipId: Number(id),
      });

      if (res.data.success) {
        setHasApplied(true);
        setAlert({
          type: 'success',
          message: 'Your internship application has been successfully submitted! Check My Applications for updates.',
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
    if (!window.confirm(`Are you sure you want to delete internship "${internship?.title}"?`)) return;
    try {
      await internshipApi.delete(id);
      navigate('/internships');
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to delete internship' });
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ margin: '4rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading internship details...</p>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="container" style={{ margin: '4rem auto', textAlign: 'center' }}>
        <h2>Internship Not Found</h2>
        <Link to="/internships" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Internships List
        </Link>
      </div>
    );
  }

  const skillsList = internship.skills
    ? internship.skills.split(',').map((s) => s.trim()).filter(Boolean)
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
      <Link to="/internships" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to All Internships
      </Link>

      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <span className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>{internship.internshipType || 'Internship'}</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{internship.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-hover)', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.3rem' }}>
              <Building2 size={18} />
              <span>{internship.company}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isAuthenticatedAdmin && (
              <>
                <Link to={`/admin/edit-internship/${internship.id}`} className="btn btn-secondary btn-sm">
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
                  <Send size={16} /> {applying ? 'Submitting...' : 'Apply for Internship'}
                </button>
              )
            )}
          </div>
        </div>

        {/* Quick Meta Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>LOCATION</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <MapPin size={16} color="var(--primary)" /> {internship.location}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>MONTHLY STIPEND</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <IndianRupee size={16} color="var(--accent)" /> {internship.stipend || 'Competitive'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>DURATION</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <Clock size={16} color="var(--warning)" /> {internship.duration || '3 Months'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>POSTED ON</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <Calendar size={16} color="var(--secondary-hover)" /> {internship.postedDate || 'Recently'}
            </div>
          </div>
        </div>

        {/* Required Skills */}
        {skillsList.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Relevant Skills</h3>
            <div className="skills-tags">
              {skillsList.map((skill, index) => (
                <span key={index} className="skill-tag" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full Internship Description */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Internship Description & Learning Outcomes</h3>
          <div style={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: '#334155', fontSize: '0.96rem' }}>
            {internship.description}
          </div>
        </div>

        {/* Bottom Apply Card */}
        {!isAuthenticatedAdmin && (
          <div style={{ background: 'var(--secondary-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', border: '1px solid #bae6fd' }}>
            <div>
              <h4 style={{ color: 'var(--secondary-hover)', fontWeight: 800 }}>Ready to gain practical experience?</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                {hasApplied ? 'You have applied for this internship opportunity.' : 'One-click application with your student credentials.'}
              </p>
            </div>
            {hasApplied ? (
              <span className="badge badge-success" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} /> Application Under Review
              </span>
            ) : (
              <button onClick={handleApply} disabled={applying} className="btn btn-primary">
                <Send size={15} /> {applying ? 'Submitting...' : 'Apply for Internship'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetails;
