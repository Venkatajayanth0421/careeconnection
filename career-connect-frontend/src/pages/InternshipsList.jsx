import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Building2, Sparkles } from 'lucide-react';
import { internshipApi, applicationApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import InternshipCard from '../components/InternshipCard';
import SearchFilterBar from '../components/SearchFilterBar';
import AlertNotification from '../components/AlertNotification';

const InternshipsList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('internshipType') || '');

  const { student, isAuthenticatedStudent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInternships();
  }, [searchParams]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const params = {};
      const kw = searchParams.get('keyword');
      const loc = searchParams.get('location');
      const type = searchParams.get('internshipType');
      if (kw) params.keyword = kw;
      if (loc) params.location = loc;
      if (type) params.internshipType = type;

      const res = await internshipApi.getAll(params);
      setInternships(res.data.data || []);
    } catch (err) {
      console.log('Error fetching internships', err);
      setAlert({ type: 'error', message: 'Unable to connect to backend server. Make sure Spring Boot is running.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const newParams = {};
    if (searchKeyword.trim()) newParams.keyword = searchKeyword.trim();
    if (selectedLocation.trim()) newParams.location = selectedLocation.trim();
    if (selectedType) newParams.internshipType = selectedType;
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setSearchKeyword('');
    setSelectedLocation('');
    setSelectedType('');
    setSearchParams({});
  };

  const handleApply = async (internship) => {
    if (!isAuthenticatedStudent) {
      setAlert({ type: 'info', message: 'Please login as a student to apply for this internship.' });
      setTimeout(() => navigate('/student/login'), 1200);
      return;
    }

    try {
      const response = await applicationApi.apply({
        studentId: student.id,
        internshipId: internship.id,
      });

      if (response.data.success) {
        setAlert({
          type: 'success',
          message: `Successfully applied to ${internship.title} at ${internship.company}!`,
        });
      } else {
        setAlert({ type: 'error', message: response.data.message || 'Failed to apply' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit application';
      setAlert({ type: 'error', message: msg });
    }
  };

  const handleDeleteInternship = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete internship "${title}"?`)) return;

    try {
      await internshipApi.delete(id);
      setAlert({ type: 'success', message: 'Internship deleted successfully' });
      fetchInternships();
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

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Browse Industrial Internships</h1>
        <p className="page-subtitle">
          Gain hands-on corporate engineering exposure with funded stipends and certificates for college students.
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
        typeOptions={['Full-time', 'Part-time', 'Virtual/Remote', 'Hybrid']}
        typeLabel="Internship Mode"
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Results Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
          Showing {internships.length} Available {internships.length === 1 ? 'Internship' : 'Internships'}
        </p>
      </div>

      {/* Internships Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="brand-icon-box" style={{ margin: '0 auto 1rem', animation: 'spin 1s infinite linear' }}>
            <Building2 size={22} />
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Loading internships...</p>
        </div>
      ) : internships.length > 0 ? (
        <div className="grid-cards">
          {internships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              onApply={handleApply}
              onDelete={handleDeleteInternship}
            />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <Building2 size={44} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No matching internships found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Try adjusting your search criteria or resetting filters to see more student opportunities.
          </p>
          <button onClick={handleReset} className="btn btn-outline btn-sm">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default InternshipsList;
