import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  Check, 
  CircleDot, 
  Send, 
  CheckCircle2, 
  IndianRupee,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { applicationApi } from '../api/api';

const AIRecommendedCard = ({ item, onApplySuccess, onShowAlert }) => {
  const { student, isAuthenticatedStudent } = useAuth();
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const isJob = item.type === 'Job';
  const detailsUrl = isJob ? `/jobs/${item.opportunityId || item.id}` : `/internships/${item.opportunityId || item.id}`;

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'ai-score-high';
    if (score >= 60) return 'ai-score-medium';
    return 'ai-score-low';
  };

  const handleApplyNow = async () => {
    if (!isAuthenticatedStudent) {
      if (onShowAlert) {
        onShowAlert({
          type: 'info',
          message: 'Please login as a student to apply directly.',
        });
      }
      setTimeout(() => navigate('/student/login'), 1200);
      return;
    }

    setApplying(true);
    try {
      const payload = {
        studentId: student.id,
        jobId: isJob ? Number(item.opportunityId || item.id) : null,
        internshipId: !isJob ? Number(item.opportunityId || item.id) : null,
      };

      const res = await applicationApi.apply(payload);
      if (res.data.success) {
        setHasApplied(true);
        if (onShowAlert) {
          onShowAlert({
            type: 'success',
            message: `Applied successfully to ${item.title} at ${item.company}!`,
          });
        }
        if (onApplySuccess) {
          onApplySuccess(item);
        }
      } else {
        if (onShowAlert) {
          onShowAlert({
            type: 'error',
            message: res.data.message || 'Application could not be completed.',
          });
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit application';
      if (onShowAlert) {
        onShowAlert({ type: 'error', message: msg });
      }
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="ai-opportunity-card">
      <div>
        {/* Header: Title, Company, Type & Match Score */}
        <div className="ai-card-match-header">
          <div>
            <span
              className={`badge ${isJob ? 'badge-primary' : 'badge-secondary'}`}
              style={{ marginBottom: '0.4rem', fontSize: '0.72rem' }}
            >
              {isJob ? <Briefcase size={12} /> : <Building2 size={12} />}
              {item.type} {item.opportunityType ? `• ${item.opportunityType}` : ''}
            </span>
            <h3 className="job-card-title" style={{ fontSize: '1.15rem' }}>
              {item.title}
            </h3>
            <div className="job-card-company" style={{ color: isJob ? 'var(--primary)' : 'var(--secondary)' }}>
              {isJob ? <Briefcase size={14} /> : <Building2 size={14} />}
              <span>{item.company}</span>
            </div>
          </div>

          {/* AI Match Badge */}
          <div className={`ai-score-pill ${getScoreBadgeClass(item.matchScore)}`}>
            <Sparkles size={13} />
            <span>AI Match: {item.matchScore}%</span>
          </div>
        </div>

        {/* Location & Compensation */}
        <div className="job-card-meta" style={{ margin: '0.5rem 0' }}>
          <div className="job-card-meta-item">
            <MapPin size={14} />
            <span>{item.location}</span>
          </div>
          {item.salaryOrStipend && (
            <div className="job-card-meta-item">
              <IndianRupee size={14} />
              <span>{item.salaryOrStipend}</span>
            </div>
          )}
          {item.duration && (
            <div className="job-card-meta-item">
              <Clock size={14} />
              <span>{item.duration}</span>
            </div>
          )}
        </div>

        {/* Skills Breakdown */}
        <div className="ai-skill-match-section">
          {/* Matched Skills */}
          {item.matchedSkills && item.matchedSkills.length > 0 && (
            <div>
              <div className="ai-matched-skills-group">
                <span className="ai-skill-label" style={{ color: '#059669' }}>
                  Matched Skills ({item.matchedSkills.length}):
                </span>
                {item.matchedSkills.map((skill, idx) => (
                  <span key={idx} className="skill-tag-matched">
                    <Check size={12} strokeWidth={3} /> {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {item.missingSkills && item.missingSkills.length > 0 && (
            <div>
              <div className="ai-missing-skills-group">
                <span className="ai-skill-label" style={{ color: '#b45309' }}>
                  Missing / To Learn:
                </span>
                {item.missingSkills.map((skill, idx) => (
                  <span key={idx} className="skill-tag-missing">
                    <CircleDot size={11} /> {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendation Reason */}
        {item.reason && (
          <div className="ai-reason-box">
            <div className="ai-reason-header">
              <Sparkles size={12} /> Why recommended
            </div>
            <p style={{ fontStyle: 'italic', margin: 0 }}>"{item.reason}"</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="job-card-actions" style={{ marginTop: '1rem' }}>
        <Link to={detailsUrl} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
          <ExternalLink size={14} /> View Details
        </Link>

        {hasApplied ? (
          <button className="btn btn-success btn-sm" disabled style={{ flex: 1, opacity: 0.9 }}>
            <CheckCircle2 size={14} /> Applied
          </button>
        ) : (
          <button
            onClick={handleApplyNow}
            disabled={applying}
            className="btn btn-primary btn-sm"
            style={{
              flex: 1,
              background: isJob
                ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                : 'linear-gradient(135deg, #0ea5e9, #10b981)',
            }}
          >
            <Send size={13} /> {applying ? 'Applying...' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AIRecommendedCard;
