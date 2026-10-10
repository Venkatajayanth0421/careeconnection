import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, IndianRupee, Calendar, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const JobCard = ({ job, onApply, onDelete }) => {
  const { isAuthenticatedAdmin } = useAuth();

  const skillsList = job.skills
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="job-card">
      <div>
        <div className="job-card-header">
          <div>
            <h3 className="job-card-title">{job.title}</h3>
            <div className="job-card-company">
              <Briefcase size={15} />
              <span>{job.company}</span>
            </div>
          </div>
          <span className="badge badge-primary">{job.jobType || 'Full-time'}</span>
        </div>

        <div className="job-card-meta">
          <div className="job-card-meta-item">
            <MapPin size={14} />
            <span>{job.location}</span>
          </div>
          {job.salary && (
            <div className="job-card-meta-item">
              <IndianRupee size={14} />
              <span>{job.salary}</span>
            </div>
          )}
          {job.postedDate && (
            <div className="job-card-meta-item">
              <Calendar size={14} />
              <span>Posted: {job.postedDate}</span>
            </div>
          )}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.6rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
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
        <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
          <ExternalLink size={14} /> View Details
        </Link>

        {isAuthenticatedAdmin ? (
          <>
            <Link to={`/admin/edit-job/${job.id}`} className="btn btn-secondary btn-sm" title="Edit Job">
              <Edit2 size={14} /> Edit
            </Link>
            <button
              onClick={() => onDelete && onDelete(job.id, job.title)}
              className="btn btn-danger btn-sm"
              title="Delete Job"
            >
              <Trash2 size={14} />
            </button>
          </>
        ) : (
          <button
            onClick={() => onApply && onApply(job)}
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
