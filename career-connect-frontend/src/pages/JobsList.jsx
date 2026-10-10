import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Briefcase, AlertCircle, Sparkles } from 'lucide-react';
import { jobApi, applicationApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import SearchFilterBar from '../components/SearchFilterBar';
import AlertNotification from '../components/AlertNotification';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('jobType') || '');

  const { student, isAuthenticatedStudent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      const kw = searchParams.get('keyword');
      const loc = searchParams.get('location');
      const type = searchParams.get('jobType');
      if (kw) params.keyword = kw;
      if (loc) params.location = loc;
      if (type) params.jobType = type;

      const res = await jobApi.getAll(params);
      setJobs(res.data.data || []);
    } catch (err) {
      console.log('Error fetching jobs', err);
      setAlert({ type: 'error', message: 'Unable to connect to backend server. Make sure Spring Boot is running.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const newParams = {};
    if (searchKeyword.trim()) newParams.keyword = searchKeyword.trim();
    if (selectedLocation.trim()) newParams.location = selectedLocation.trim();
    if (selectedType) newParams.jobType = selectedType;
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setSearchKeyword('');
    setSelectedLocation('');
    setSelectedType('');
    setSearchParams({});
  };

  const handleApply = async (job) => {
    if (!isAuthenticatedStudent) {
      setAlert({ type: 'info', message: 'Please login as a student to apply for this job.' });
      setTimeout(() => navigate('/student/login'), 1200);
      return;
    }

    try {
      const response = await applicationApi.apply({
        studentId: student.id,
        jobId: job.id,
      });

      if (response.data.success) {
        setAlert({
          type: 'success',
          message: `Successfully applied to ${job.title} at ${job.company}!`,
        });
      } else {
        setAlert({ type: 'error', message: response.data.message || 'Failed to apply' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit application';
      setAlert({ type: 'error', message: msg });
    }
  };

  const handleDeleteJob = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete job "${title}"?`)) return;

    try {
      await jobApi.delete(id);
      setAlert({ type: 'success', message: 'Job deleted successfully' });
      fetchJobs();
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to delete job' });
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
        <h1 className="page-title">Browse Full-Time Jobs</h1>
        <p className="page-subtitle">
          Explore campus placement openings, entry-level developer positions, and high-growth engineering roles.
        </p>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        typeOptions={['Full-time', 'Part-time', 'Remote', 'Hybrid']}
        typeLabel="Job Type"
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Results Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
          Showing {jobs.length} Available {jobs.length === 1 ? 'Job' : 'Jobs'}
        </p>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="brand-icon-box" style={{ margin: '0 auto 1rem', animation: 'spin 1s infinite linear' }}>
            <Briefcase size={22} />
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Loading available jobs...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid-cards">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={handleApply}
              onDelete={handleDeleteJob}
            />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Briefcase size={44} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No matching jobs found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Try adjusting your search criteria or resetting filters to see more opportunities.
          </p>
          <button onClick={handleReset} className="btn btn-outline btn-sm">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsList;
