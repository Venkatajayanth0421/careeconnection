import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  Building2, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  User,
  Wrench,
  Edit2,
  MapPin,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { applicationApi, jobApi, internshipApi, studentApi } from '../api/api';
import AlertNotification from '../components/AlertNotification';
import AIRecommendationSection from '../components/AIRecommendationSection';

const StudentDashboard = () => {
  const { student, isAuthenticatedStudent, updateStudentContext } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalInternships, setTotalInternships] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Edit Profile / Skills Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    skills: '',
    qualification: '',
    preferredLocation: '',
    phone: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!isAuthenticatedStudent) {
      navigate('/student/login');
      return;
    }
    loadDashboardData();
  }, [student, isAuthenticatedStudent]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load student applications
      const appsRes = await applicationApi.getByStudent(student.id);
      setApplications(appsRes.data.data || []);

      // Load counts
      const [jobsRes, internsRes] = await Promise.all([
        jobApi.getAll(),
        internshipApi.getAll()
      ]);
      setTotalJobs(jobsRes.data.data?.length || 0);
      setTotalInternships(internsRes.data.data?.length || 0);
    } catch (err) {
      console.log('Error loading dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  const openEditModal = () => {
    setEditFormData({
      skills: student?.skills || '',
      qualification: student?.qualification || '',
      preferredLocation: student?.preferredLocation || '',
      phone: student?.phone || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await studentApi.update(student.id, editFormData);
      if (res.data.success) {
        updateStudentContext(res.data.data);
        setAlert({
          type: 'success',
          message: 'Profile skills updated! AI recommendations refreshed.',
        });
        setIsEditModalOpen(false);
      } else {
        setAlert({ type: 'error', message: res.data.message || 'Failed to update profile' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error saving profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  // Status counters
  const pendingCount = applications.filter(a => a.status === 'PENDING').length;
  const shortlistedCount = applications.filter(a => a.status === 'SHORTLISTED').length;
  const acceptedCount = applications.filter(a => a.status === 'ACCEPTED').length;
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="badge badge-success"><CheckCircle size={12} /> Accepted</span>;
      case 'SHORTLISTED':
        return <span className="badge badge-primary"><AlertCircle size={12} /> Shortlisted</span>;
      case 'REJECTED':
        return <span className="badge badge-danger"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="badge badge-warning"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div className="container" style={{ margin: '2rem auto' }}>
      {alert && (
        <AlertNotification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header Profile Greeting */}
      <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%)', border: '1px solid #c7d2fe' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Welcome back, {student.name}! 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
              Student ID #{student.id} • {student.qualification || 'B.Tech Student'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              <Briefcase size={15} /> Apply to Jobs
            </Link>
            <Link to="/internships" className="btn btn-secondary btn-sm">
              <Building2 size={15} /> Apply to Internships
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>{applications.length}</h3>
            <p>Total Applications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>{pendingCount}</h3>
            <p>Under Review (Pending)</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>{acceptedCount + shortlistedCount}</h3>
            <p>Shortlisted / Accepted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--secondary-light)', color: 'var(--secondary-hover)' }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalJobs + totalInternships}</h3>
            <p>Open Opportunities</p>
          </div>
        </div>
      </div>

      {/* 🤖 AI Recommended For You Section */}
      <AIRecommendationSection 
        customStudentId={student?.id}
        title="🤖 AI Recommended For You"
        subtitle={`Intelligent opportunities computed for ${student?.name} based on skill compatibility & qualifications`}
      />

      {/* Two Column Layout: Student Details & Recent Applications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Student Profile Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <User size={18} color="var(--primary)" /> Student Profile
            </h3>
            <button 
              onClick={openEditModal} 
              className="btn btn-outline btn-sm" 
              style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
              title="Edit Profile Skills"
            >
              <Edit2 size={13} /> Edit Skills
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.78rem' }}>FULL NAME</span>
              <span style={{ fontWeight: 600 }}>{student.name}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.78rem' }}>EMAIL</span>
              <span style={{ fontWeight: 600 }}>{student.email}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.78rem' }}>PHONE</span>
              <span style={{ fontWeight: 600 }}>{student.phone || 'Not provided'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.78rem' }}>QUALIFICATION</span>
              <span style={{ fontWeight: 600 }}>{student.qualification || 'Not provided'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.78rem' }}>SKILLS</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {student.skills ? (
                  student.skills.split(',').map((skill, i) => (
                    <span key={i} className="skill-tag">{skill.trim()}</span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>None listed</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Applications Status Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--primary)" /> Recent Applications & Status
            </h3>
            <Link to="/my-applications" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {applications.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Role / Title</th>
                    <th>Type</th>
                    <th>Company</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => {
                    const isJob = !!app.job;
                    const item = isJob ? app.job : app.internship;
                    return (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 600 }}>
                          {item ? item.title : 'Position unavailable'}
                        </td>
                        <td>
                          {isJob ? (
                            <span className="badge badge-primary">Job</span>
                          ) : (
                            <span className="badge badge-secondary">Internship</span>
                          )}
                        </td>
                        <td>{item ? item.company : '—'}</td>
                        <td>{app.applicationDate || 'Recent'}</td>
                        <td>{getStatusBadge(app.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <FileText size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
              <h4>No applications yet</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.5rem 0 1rem' }}>
                You haven't applied for any jobs or internships yet. Start applying today!
              </p>
              <Link to="/jobs" className="btn btn-primary btn-sm">
                Browse Available Jobs
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile & Skills Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Update Profile & Skills</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Update your skills or preferred locations. The AI recommendation algorithm will automatically recalculate match scores for all opportunities!
            </p>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Technical Skills (Comma separated)</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Java, Spring Boot, MySQL, React, AWS, Docker"
                  value={editFormData.skills}
                  onChange={(e) => setEditFormData({ ...editFormData, skills: e.target.value })}
                />
                <span style={{ fontSize: '0.76rem', color: 'var(--text-light)', marginTop: '2px' }}>
                  Tip: Adding skills like Docker, AWS, or Microservices directly boosts your match percentages!
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Academic Qualification</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. B.Tech Computer Science (Final Year)"
                  value={editFormData.qualification}
                  onChange={(e) => setEditFormData({ ...editFormData, qualification: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Location / Cities</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bangalore, Hyderabad, Remote"
                  value={editFormData.preferredLocation}
                  onChange={(e) => setEditFormData({ ...editFormData, preferredLocation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="e.g. 9876543210"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn btn-primary"
                >
                  <Sparkles size={15} /> {savingProfile ? 'Saving...' : 'Save & Re-run AI Match'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
