import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Briefcase, 
  Building2, 
  FileText, 
  Users, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminApi, jobApi, internshipApi, applicationApi } from '../api/api';
import AlertNotification from '../components/AlertNotification';

const AdminDashboard = () => {
  const { admin, isAuthenticatedAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalInternships: 0,
    totalApplications: 0,
    totalStudents: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });

  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('applications'); // 'applications', 'jobs', 'internships'
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!isAuthenticatedAdmin) {
      navigate('/admin/login');
      return;
    }
    loadAdminData();
  }, [isAuthenticatedAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, jobsRes, internsRes, appsRes] = await Promise.all([
        adminApi.getStats(),
        jobApi.getAll(),
        internshipApi.getAll(),
        applicationApi.getAll(),
      ]);

      if (statsRes.data?.data) setStats(statsRes.data.data);
      if (jobsRes.data?.data) setJobs(jobsRes.data.data);
      if (internsRes.data?.data) setInternships(internsRes.data.data);
      if (appsRes.data?.data) setApplications(appsRes.data.data);
    } catch (err) {
      console.log('Error fetching admin dashboard data', err);
      setAlert({ type: 'error', message: 'Failed to load administration data. Check Spring Boot backend.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await applicationApi.updateStatus(appId, newStatus);
      if (res.data.success) {
        setAlert({ type: 'success', message: `Application #${appId} updated to ${newStatus}` });
        // Refresh local state
        setApplications(applications.map(a => a.id === appId ? { ...a, status: newStatus } : a));
        // Refresh stats
        const statsRes = await adminApi.getStats();
        if (statsRes.data?.data) setStats(statsRes.data.data);
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to update application status' });
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Delete job posting: "${title}"?`)) return;
    try {
      await jobApi.delete(jobId);
      setAlert({ type: 'success', message: 'Job posting deleted' });
      setJobs(jobs.filter(j => j.id !== jobId));
      loadAdminData();
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to delete job' });
    }
  };

  const handleDeleteInternship = async (internshipId, title) => {
    if (!window.confirm(`Delete internship posting: "${title}"?`)) return;
    try {
      await internshipApi.delete(internshipId);
      setAlert({ type: 'success', message: 'Internship posting deleted' });
      setInternships(internships.filter(i => i.id !== internshipId));
      loadAdminData();
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to delete internship' });
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

      {/* Admin Header */}
      <div className="card" style={{ marginBottom: '2rem', background: '#0f172a', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={24} color="#38bdf8" />
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Placement Control Panel</h1>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Logged in as Administrator: {admin?.username} • Manage postings and candidate status
            </p>
          </div>
          <Link to="/admin/add-opportunity" className="btn btn-primary">
            <PlusCircle size={16} /> Post New Opportunity
          </Link>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Briefcase size={26} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalJobs || jobs.length}</h3>
            <p>Active Job Postings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--secondary-light)', color: 'var(--secondary-hover)' }}>
            <Building2 size={26} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalInternships || internships.length}</h3>
            <p>Active Internships</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <FileText size={26} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalApplications || applications.length}</h3>
            <p>Total Applications Received</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Users size={26} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalStudents || 0}</h3>
            <p>Registered Students</p>
          </div>
        </div>
      </div>

      {/* Management Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('applications')}
          className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline'}`}
        >
          <FileText size={16} /> Review Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`btn ${activeTab === 'jobs' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Briefcase size={16} /> Manage Jobs ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('internships')}
          className={`btn ${activeTab === 'internships' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Building2 size={16} /> Manage Internships ({internships.length})
        </button>
      </div>

      {/* TAB 1: Review Applications & Change Status */}
      {activeTab === 'applications' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Student Applications</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Change status dropdown to instantly update student's application state
            </span>
          </div>

          {applications.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Candidate Name</th>
                    <th>Email & Contact</th>
                    <th>Position Applied</th>
                    <th>Applied Date</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => {
                    const isJob = !!app.job;
                    const item = isJob ? app.job : app.internship;
                    const student = app.student;

                    return (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 700, color: 'var(--text-light)' }}>#{app.id}</td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{student ? student.name : 'Unknown Candidate'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {student?.qualification || 'Candidate'}
                          </div>
                        </td>
                        <td>
                          <div>{student?.email}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student?.phone || 'No phone'}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{item ? item.title : '—'}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--primary)' }}>
                            {item ? item.company : '—'} • {isJob ? 'Job' : 'Internship'}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {app.applicationDate || 'Recent'}
                        </td>
                        <td>
                          <select
                            className="form-control"
                            style={{
                              padding: '0.35rem 0.6rem',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor:
                                app.status === 'ACCEPTED'
                                  ? '#dcfce7'
                                  : app.status === 'SHORTLISTED'
                                  ? '#e0e7ff'
                                  : app.status === 'REJECTED'
                                  ? '#fee2e2'
                                  : '#fef3c7',
                            }}
                            value={app.status || 'PENDING'}
                            onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="SHORTLISTED">SHORTLISTED</option>
                            <option value="ACCEPTED">ACCEPTED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <FileText size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <h3>No applications received yet</h3>
              <p style={{ color: 'var(--text-muted)' }}>When students apply for jobs or internships, they will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Manage Jobs */}
      {activeTab === 'jobs' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Job Postings Directory</h3>
            <Link to="/admin/add-opportunity?type=job" className="btn btn-primary btn-sm">
              <PlusCircle size={15} /> Add New Job
            </Link>
          </div>

          {jobs.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Role Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Salary / Package</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td style={{ color: 'var(--text-light)', fontWeight: 600 }}>#{job.id}</td>
                      <td style={{ fontWeight: 700 }}>{job.title}</td>
                      <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{job.company}</td>
                      <td>{job.location}</td>
                      <td>{job.salary || '—'}</td>
                      <td>
                        <span className="badge badge-primary">{job.jobType || 'Full-time'}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <Link to={`/admin/edit-job/${job.id}`} className="btn btn-secondary btn-sm" title="Edit">
                            <Edit2 size={13} />
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className="btn btn-danger btn-sm"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Briefcase size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <h3>No jobs posted</h3>
              <Link to="/admin/add-opportunity?type=job" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                Create First Job
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Manage Internships */}
      {activeTab === 'internships' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Internship Postings Directory</h3>
            <Link to="/admin/add-opportunity?type=internship" className="btn btn-primary btn-sm">
              <PlusCircle size={15} /> Add New Internship
            </Link>
          </div>

          {internships.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Internship Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Stipend</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {internships.map((internship) => (
                    <tr key={internship.id}>
                      <td style={{ color: 'var(--text-light)', fontWeight: 600 }}>#{internship.id}</td>
                      <td style={{ fontWeight: 700 }}>{internship.title}</td>
                      <td style={{ color: 'var(--secondary-hover)', fontWeight: 600 }}>{internship.company}</td>
                      <td>{internship.location}</td>
                      <td>{internship.stipend || '—'}</td>
                      <td>
                        <span className="badge badge-secondary">{internship.duration || '3 Mos'}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <Link to={`/admin/edit-internship/${internship.id}`} className="btn btn-secondary btn-sm" title="Edit">
                            <Edit2 size={13} />
                          </Link>
                          <button
                            onClick={() => handleDeleteInternship(internship.id, internship.title)}
                            className="btn btn-danger btn-sm"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Building2 size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <h3>No internships posted</h3>
              <Link to="/admin/add-opportunity?type=internship" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                Create First Internship
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
