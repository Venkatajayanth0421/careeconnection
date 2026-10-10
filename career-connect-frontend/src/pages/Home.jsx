import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  GraduationCap, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Users, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { jobApi, internshipApi } from '../api/api';
import JobCard from '../components/JobCard';
import InternshipCard from '../components/InternshipCard';
import AlertNotification from '../components/AlertNotification';
import AIRecommendationSection from '../components/AIRecommendationSection';

const Home = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentInternships, setRecentInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedOpportunities();
  }, []);

  const fetchFeaturedOpportunities = async () => {
    setLoading(true);
    try {
      const [jobsRes, internshipsRes] = await Promise.all([
        jobApi.getAll(),
        internshipApi.getAll()
      ]);
      setRecentJobs((jobsRes.data.data || []).slice(0, 3));
      setRecentInternships((internshipsRes.data.data || []).slice(0, 3));
    } catch (err) {
      console.log('Backend not connected or empty, using empty defaults', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div>
      {alert && (
        <AlertNotification 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        color: '#ffffff',
        padding: '5rem 0 6rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-5%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.12)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Sparkles size={16} color="#38bdf8" /> B.Tech Career & Placement Launchpad
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            maxWidth: '850px',
            margin: '0 auto 1.25rem'
          }}>
            Unlock High-Growth Jobs & Industrial Internships
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#cbd5e1',
            maxWidth: '650px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}>
            Your single portal to discover top verified graduate roles, technical internships, and track applications with real-time status updates.
          </p>

          {/* Quick Search Form */}
          <form 
            onSubmit={handleHeroSearch} 
            style={{
              maxWidth: '620px',
              margin: '0 auto',
              display: 'flex',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '0.8rem', gap: '0.5rem' }}>
              <Search size={20} color="#64748b" />
              <input
                type="text"
                placeholder="Job title, technical skill, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.95rem',
                  color: '#0f172a'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.6rem' }}>
              Search Opportunities
            </button>
          </form>

          {/* Quick Action Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
            <Link to="/jobs" style={{ color: '#93c5fd', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Explore All Jobs <ArrowRight size={14} />
            </Link>
            <span style={{ color: '#64748b' }}>•</span>
            <Link to="/internships" style={{ color: '#6ee7b7', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Explore Internships <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Counter */}
      <section style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Briefcase size={26} />
              </div>
              <div className="stat-info">
                <h3>50+</h3>
                <p>Full-Time Technical Jobs</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--secondary-light)', color: 'var(--secondary-hover)' }}>
                <GraduationCap size={26} />
              </div>
              <div className="stat-info">
                <h3>35+</h3>
                <p>Industrial Internships</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                <Building2 size={26} />
              </div>
              <div className="stat-info">
                <h3>25+</h3>
                <p>Partner Tech Companies</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                <Users size={26} />
              </div>
              <div className="stat-info">
                <h3>500+</h3>
                <p>Students Placed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🤖 AI Job & Internship Recommendation Feature */}
      <section style={{ padding: '3.5rem 0 1rem' }}>
        <div className="container">
          <AIRecommendationSection 
            title="🤖 AI Recommended For You"
            subtitle="Personalized opportunities analyzed against verified technical skills and academic background"
          />
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: '3.5rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Top Careers</span>
              <h2 className="page-title" style={{ fontSize: '1.75rem' }}>Recent Full-Time Job Openings</h2>
              <p className="page-subtitle">Discover high paying positions from software engineering to cloud architecture</p>
            </div>
            <Link to="/jobs" className="btn btn-outline btn-sm">
              View All Jobs <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-cards">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onApply={() => navigate(`/jobs/${job.id}`)} 
                />
              ))
            ) : (
              <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                <Briefcase size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <h3>No jobs posted yet</h3>
                <p style={{ color: 'var(--text-muted)' }}>Start the Spring Boot backend or visit the admin portal to add jobs!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Internships Section */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>Student Opportunities</span>
              <h2 className="page-title" style={{ fontSize: '1.75rem' }}>Featured Industrial Internships</h2>
              <p className="page-subtitle">Gain real-world industry experience with monthly stipends and certificates</p>
            </div>
            <Link to="/internships" className="btn btn-outline btn-sm">
              View All Internships <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-cards">
            {recentInternships.length > 0 ? (
              recentInternships.map((internship) => (
                <InternshipCard 
                  key={internship.id} 
                  internship={internship} 
                  onApply={() => navigate(`/internships/${internship.id}`)} 
                />
              ))
            ) : (
              <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                <GraduationCap size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <h3>No internships posted yet</h3>
                <p style={{ color: 'var(--text-muted)' }}>Check back soon or add some from the Admin Panel!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it Works / 3 Steps */}
      <section style={{ background: '#ffffff', padding: '4.5rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Simple 3-Step Process</span>
            <h2 className="page-title" style={{ fontSize: '1.85rem' }}>How Campus Career Hub Works</h2>
            <p className="page-subtitle">A streamlined pathway for college graduates to secure their ideal career opportunity.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Create Student Profile</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Register with your college degree, academic qualifications, and list your top technical programming skills.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--secondary-light)',
                color: 'var(--secondary-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Search & Filter</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Filter listings by preferred tech stack, company, job location (remote/hybrid/onsite), and package/stipend.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Apply & Track Status</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Submit applications with 1 click. Check your personalized dashboard as the status updates from Pending to Shortlisted!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
