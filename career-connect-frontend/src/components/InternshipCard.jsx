import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Clock, IndianRupee, Calendar, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InternshipCard = ({ internship, onApply, onDelete }) => {
  const { isAuthenticatedAdmin } = useAuth();

  const skillsList = internship.skills
    ? internship.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="job-card">
      <div>
        <div className="job-card-header">
          <div>
            <h3 className="job-card-title">{internship.title}</h3>
            <div className="job-card-company" style={{ color: 'var(--secondary)' }}>
              <Building2 size={15} />
              <span>{internship.company}</span>
            </div>
          </div>
          <span className="badge badge-secondary">{internship.internshipType || 'Internship'}</span>
        </div>

        <div className="job-card-meta">
          <div className="job-card-meta-item">
            <MapPin size={14} />
            <span>{internship.location}</span>
          </div>
          {internship.stipend && (
            <div className="job-card-meta-item">
              <IndianRupee size={14} />
              <span>{internship.stipend}</span>
            </div>
          )}
          {internship.duration && (
            <div className="job-card-meta-item">
              <Clock size={14} />
              <span>{internship.duration}</span>
            </div>
          )}
          {internship.postedDate && (
            <div className="job-card-meta-item">
              <Calendar size={14} />
              <span>Posted: {internship.postedDate}</span>
            </div>
          )}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.6rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {internship.description}
        </p>

        {skillsList.length > 0 && (
          <div className="skills-tags">
            {skillsList.map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="job-card-actions">
        <Link to={`/internships/${internship.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
          <ExternalLink size={14} /> View Details
        </Link>

        {isAuthenticatedAdmin ? (
          <>
            <Link to={`/admin/edit-internship/${internship.id}`} className="btn btn-secondary btn-sm" title="Edit Internship">
              <Edit2 size={14} /> Edit
            </Link>
            <button
              onClick={() => onDelete && onDelete(internship.id, internship.title)}
              className="btn btn-danger btn-sm"
              title="Delete Internship"
            >
              <Trash2 size={14} />
            </button>
          </>
        ) : (
          <button
            onClick={() => onApply && onApply(internship)}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, backgroundColor: 'var(--primary)', color: '#fff', border: 'none' }}
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default InternshipCard;
