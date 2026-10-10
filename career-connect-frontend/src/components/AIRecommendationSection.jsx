import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Briefcase, 
  Building2, 
  AlertCircle, 
  TrendingUp, 
  BookOpen, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recommendationApi } from '../api/api';
import AIRecommendedCard from './AIRecommendedCard';
import AlertNotification from './AlertNotification';

const AIRecommendationSection = ({ 
  customStudentId = null, 
  title = "🤖 AI Recommended For You",
  subtitle = "Personalized opportunities analyzed against your verified skills and academic qualification",
  initialFilter = "ALL",
  compact = false
}) => {
  const { student, isAuthenticatedStudent } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [currentMatchScore, setCurrentMatchScore] = useState(0);
  const [activeFilter, setActiveFilter] = useState(initialFilter); // ALL, JOBS, INTERNSHIPS, HIGH_MATCH
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [studentSkillsUsed, setStudentSkillsUsed] = useState([]);

  // Effective student ID
  const effectiveStudentId = customStudentId || (isAuthenticatedStudent ? student?.id : null);

  useEffect(() => {
    fetchRecommendations();
  }, [effectiveStudentId, student?.skills]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (effectiveStudentId) {
        // Authenticated student recommendations
        res = await recommendationApi.getForStudent(effectiveStudentId);
      } else {
        // Guest explorer recommendations (e.g. for Home page when not logged in)
        res = await recommendationApi.getGuestRecommendations({
          skills: 'Java, Spring Boot, React, MySQL',
          qualification: 'B.Tech Computer Science',
          location: 'Bangalore, India',
          interests: 'Software Development',
        });
      }

      if (res && res.data && res.data.success) {
        const payload = res.data.data;
        setRecommendations(payload.recommendations || []);
        setRecommendedSkills(payload.recommendedSkills || ['Docker', 'AWS', 'Microservices']);
        setCurrentMatchScore(payload.currentMatchScore || 78);
        setStudentSkillsUsed(payload.studentSkills || []);
      } else if (Array.isArray(res?.data)) {
        setRecommendations(res.data);
      } else {
        setError('Unable to generate recommendations. Please try again.');
      }
    } catch (err) {
      console.error('Failed to load AI recommendations', err);
      setError('Unable to generate recommendations. Please try again.');
    } finally {
      // Small simulated delay if too quick to ensure students see the AI analysis effect
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  };

  const handleFindOpportunitiesForMe = () => {
    fetchRecommendations();
  };

  // Filter recommendations
  const filteredList = recommendations.filter((item) => {
    if (activeFilter === 'JOBS') return item.type === 'Job';
    if (activeFilter === 'INTERNSHIPS') return item.type === 'Internship';
    if (activeFilter === 'HIGH_MATCH') return item.matchScore >= 80;
    return true; // ALL
  });

  return (
    <div className="ai-section-wrapper" id="ai-recommendations">
      {alert && (
        <AlertNotification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header Bar */}
      <div className="ai-header">
        <div className="ai-header-title-box">
          <div className="ai-robot-badge">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="ai-title">{title}</h2>
            <p className="ai-subtitle">{subtitle}</p>
          </div>
        </div>

        {/* Action Button: Find Opportunities For Me */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleFindOpportunitiesForMe}
            disabled={loading}
            className="btn btn-primary"
            style={{
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              padding: '0.65rem 1.25rem'
            }}
          >
            <Sparkles size={16} />
            <span>{loading ? 'Analyzing Profile...' : '✨ Find Opportunities For Me'}</span>
          </button>
        </div>
      </div>

      {/* Active Skills Pill Bar */}
      {studentSkillsUsed && studentSkillsUsed.length > 0 && (
        <div style={{
          background: 'rgba(238, 242, 255, 0.6)',
          border: '1px solid #c7d2fe',
          borderRadius: 'var(--radius-md)',
          padding: '0.6rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.84rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: '#3730a3' }}>Matching Profile Skills:</span>
            {studentSkillsUsed.map((sk, idx) => (
              <span 
                key={idx} 
                style={{ 
                  background: '#ffffff', 
                  color: '#4338ca', 
                  padding: '0.15rem 0.5rem', 
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  border: '1px solid #c7d2fe'
                }}
              >
                {sk}
              </span>
            ))}
          </div>

          {!isAuthenticatedStudent && (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontStyle: 'italic' }}>
              Sample Student Profile (Rahul Sharma, B.Tech CS)
            </span>
          )}
        </div>
      )}

      {/* Improve Your Match Section */}
      {!loading && !error && (
        <div className="improve-match-card">
          <div className="improve-match-info">
            {/* Current Match Meter */}
            <div className="improve-match-score-badge">
              <span className="improve-match-score-num">{currentMatchScore}%</span>
              <span className="improve-match-score-lbl">Avg Match</span>
            </div>

            {/* Recommendations */}
            <div className="improve-match-skills-box">
              <div className="improve-match-heading">
                <TrendingUp size={16} color="#059669" />
                <span>Improve Your Match</span>
              </div>
              <p style={{ fontSize: '0.83rem', color: '#065f46', margin: 0 }}>
                Learn these high-demand skills to elevate your profile match up to <strong>95%+</strong>:
              </p>
              <div className="recommended-skills-list" style={{ marginTop: '0.35rem' }}>
                {recommendedSkills.map((sk, idx) => (
                  <span key={idx} className="skill-learn-pill">
                    + {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#047857', textAlign: 'right' }}>
            <span style={{ fontWeight: 600 }}>Algorithm:</span> Weighted skill overlap, job description context & degree alignment
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="ai-filter-tabs">
          <button
            className={`ai-filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            All Opportunities ({recommendations.length})
          </button>
          <button
            className={`ai-filter-btn ${activeFilter === 'JOBS' ? 'active' : ''}`}
            onClick={() => setActiveFilter('JOBS')}
          >
            <Briefcase size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Jobs ({recommendations.filter(r => r.type === 'Job').length})
          </button>
          <button
            className={`ai-filter-btn ${activeFilter === 'INTERNSHIPS' ? 'active' : ''}`}
            onClick={() => setActiveFilter('INTERNSHIPS')}
          >
            <Building2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Internships ({recommendations.filter(r => r.type === 'Internship').length})
          </button>
          <button
            className={`ai-filter-btn ${activeFilter === 'HIGH_MATCH' ? 'active' : ''}`}
            onClick={() => setActiveFilter('HIGH_MATCH')}
          >
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Highest Match (80%+) ({recommendations.filter(r => r.matchScore >= 80).length})
          </button>
        </div>

        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredList.length}</strong> sorted opportunities
        </span>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="ai-loading-box">
          <div className="ai-pulse-icon">
            <Sparkles size={28} />
          </div>
          <div className="ai-loading-text">
            🤖 AI is analyzing your skills and finding the best opportunities...
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '460px', margin: '0.4rem auto 0' }}>
            Evaluating technical stack overlap, qualification criteria, and location preferences across live listings.
          </p>
        </div>
      )}

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="ai-error-box">
          <AlertCircle size={36} style={{ margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Unable to generate recommendations. Please try again.
          </h4>
          <p style={{ fontSize: '0.88rem', margin: '0.4rem 0 1.25rem' }}>
            Please verify your network connection or ensure the service is running.
          </p>
          <button onClick={fetchRecommendations} className="btn btn-outline btn-sm">
            <RotateCw size={14} /> Retry AI Match
          </button>
        </div>
      )}

      {/* RECOMMENDATIONS GRID */}
      {!loading && !error && filteredList.length > 0 && (
        <div className="ai-rec-grid">
          {filteredList.map((item, idx) => (
            <AIRecommendedCard
              key={`${item.type}-${item.opportunityId || item.id || idx}`}
              item={item}
              onShowAlert={(a) => setAlert(a)}
              onApplySuccess={() => {}}
            />
          ))}
        </div>
      )}

      {/* EMPTY FILTER STATE */}
      {!loading && !error && filteredList.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Filter size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
          <h4>No matching opportunities found for this filter</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.5rem 0 1rem' }}>
            Try selecting "All Opportunities" or click below to re-analyze your profile.
          </p>
          <button onClick={() => setActiveFilter('ALL')} className="btn btn-outline btn-sm">
            Show All Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationSection;
