import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getExperts } from '../utils/api';

const CATEGORIES = ['All', 'Technology', 'Finance', 'Health', 'Legal', 'Marketing', 'Design', 'Education', 'Business'];

function ExpertCard({ expert }) {
  return (
    <Link to={`/experts/${expert._id}`} className="expert-card">
      <div className="expert-card-header">
        <img
          src={expert.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${expert.name}`}
          alt={expert.name}
          className="expert-avatar"
        />
        <div className="expert-info">
          <div className="expert-name">{expert.name}</div>
          <div className="expert-category-badge">{expert.category}</div>
        </div>
      </div>
      <div className="expert-bio">{expert.bio}</div>
      <div className="skills-list">
        {expert.skills?.slice(0, 3).map((s) => (
          <span key={s} className="skill-tag">{s}</span>
        ))}
      </div>
      <div className="expert-meta">
        <div className="expert-rating">
          <span className="star">★</span>
          {expert.rating?.toFixed(1)}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({expert.experience}yr exp)</span>
        </div>
        <div className="expert-rate">
          ${expert.hourlyRate}<span>/hr</span>
        </div>
      </div>
    </Link>
  );
}

export default function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [searchInput, setSearchInput] = useState('');

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getExperts({ search, category, page, limit: 6 });
      setExperts(data.experts);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load experts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => { fetchExperts(); }, [fetchExperts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Find Your Expert</h1>
        <p>Book a session with world-class professionals</p>
      </div>

      <div className="search-filter-bar">
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 240 }}>
          <div className="search-input-wrapper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name or expertise..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </form>
        <div className="filter-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-tab${category === cat ? ' active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-wrapper">
          <div className="spinner" />
          <p className="loading-text">Loading experts...</p>
        </div>
      ) : error ? (
        <div className="error-box">⚠ {error}</div>
      ) : experts.length === 0 ? (
        <div className="empty-state">
          <h3>No experts found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <>
          <div className="expert-grid">
            {experts.map((e) => <ExpertCard key={e._id} expert={e} />)}
          </div>
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >←</button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pagination-btn${p === page ? ' active' : ''}`}
                  onClick={() => setPage(p)}
                >{p}</button>
              ))}
              <button
                className="pagination-btn"
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >→</button>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Showing {experts.length} of {pagination.total} experts
          </div>
        </>
      )}
    </div>
  );
}
