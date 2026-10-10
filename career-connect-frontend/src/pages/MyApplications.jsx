import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  ExternalLink,
  Briefcase,
  Building2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { applicationApi } from '../api/api';
import AlertNotification from '../components/AlertNotification';

const MyApplications = () => {
  const { student, isAuthenticatedStudent } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!isAuthenticatedStudent) {
      navigate('/student/login');
      return;
    }
    fetchApplications();
  }, [student, isAuthenticatedStudent]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationApi.getByStudent(student.id);
      setApplications(res.data.data || []);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load your applications.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status?.toUpperCase() === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACCEPTED':
        return <span className="badge badge-success"><CheckCircle size={13} /> Accepted</span>;
      case 'SHORTLISTED':
        return <span className="badge badge-primary"><AlertCircle size={13} /> Shortlisted</span>;
      case 'REJECTED':
        return <span className="badge badge-danger"><XCircle size={13} /> Rejected</span>;
      default:
        return <span className="badge badge-warning"><Clock size={13} /> Pending Review</span>;
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

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">My Applications Tracker</h1>
        <p className="page-subtitle">
          Real-time status tracking for all the jobs and internships you have applied for.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {['ALL', 'PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '9999px', textTransform: 'capitalize' }}
          >
            {st.toLowerCase()} ({st === 'ALL' ? applications.length : applications.filter(a => a.status === st).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading applications...</p>
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Role & Position</th>
                <th>Company</th>
                <th>Type</th>
                <th>Applied Date</th>
                <th>Application Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => {
                const isJob = !!app.job;
                const item = isJob ? app.job : app.internship;
                const detailLink = isJob ? `/jobs/${item?.id}` : `/internships/${item?.id}`;

                return (
                  <tr key={app.id}>
                    <td style={{ color: 'var(--text-light)', fontWeight: 600 }}>#{app.id}</td>
                    <td style={{ fontWeight: 700 }}>
                      <Link to={detailLink} style={{ color: 'var(--text-main)' }}>
                        {item ? item.title : 'Details Unavailable'}
                      </Link>
                    </td>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>
                      {item ? item.company : '—'}
                    </td>
                    <td>
                      {isJob ? (
                        <span className="badge badge-primary">Full-Time Job</span>
                      ) : (
                        <span className="badge badge-secondary">Internship</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <Calendar size={13} /> {app.applicationDate || 'Recent'}
                      </div>
                    </td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      <Link to={detailLink} className="btn btn-outline btn-sm">
                        <ExternalLink size={13} /> View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <FileText size={44} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3>No applications in this category</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>
            Browse open vacancies and start submitting applications.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              <Briefcase size={14} /> Browse Jobs
            </Link>
            <Link to="/internships" className="btn btn-secondary btn-sm">
              <Building2 size={14} /> Browse Internships
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
