import React from 'react';
import { Search, MapPin, Briefcase, RotateCcw } from 'lucide-react';

const SearchFilterBar = ({
  searchKeyword,
  setSearchKeyword,
  selectedLocation,
  setSelectedLocation,
  selectedType,
  setSelectedType,
  typeOptions = ['Full-time', 'Part-time', 'Remote', 'Hybrid'],
  typeLabel = 'Job Type',
  onSearch,
  onReset
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <div className="filter-card">
      <form onSubmit={handleSubmit} className="filter-grid">
        {/* Keyword Search */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Search size={14} /> Search Keyword
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by role, company, or skills..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        {/* Location Filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} /> Location
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Bangalore, Remote"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Briefcase size={14} /> {typeLabel}
          </label>
          <select
            className="form-control"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {typeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ height: '42px', flex: 1 }}>
            <Search size={16} /> Filter
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ height: '42px', padding: '0 0.8rem' }}
            onClick={onReset}
            title="Reset Filters"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilterBar;
