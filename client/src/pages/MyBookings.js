import React, { useState } from 'react';
import { getBookingsByEmail } from '../utils/api';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await getBookingsByEmail(email.trim());
      setBookings(data);
      setSearched(true);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Enter your email to view all your sessions</p>
      </div>

      <form className="email-search-form" onSubmit={handleSearch}>
        <div className="search-input-wrapper" style={{ flex: 1, maxWidth: 380 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <input
            className="search-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="email-search-btn">Find Bookings</button>
      </form>

      {loading && (
        <div className="loading-wrapper">
          <div className="spinner" />
          <p className="loading-text">Loading bookings...</p>
        </div>
      )}

      {error && <div className="error-box">⚠ {error}</div>}

      {!loading && searched && bookings.length === 0 && (
        <div className="empty-state">
          <h3>No bookings found</h3>
          <p>We couldn't find any bookings for <strong>{email}</strong>.</p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <>
          <div style={{ marginBottom: 16, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Found <strong>{bookings.length}</strong> booking{bookings.length !== 1 ? 's' : ''} for <strong>{email}</strong>
          </div>
          <div className="bookings-grid">
            {bookings.map((b) => (
              <div key={b._id} className={`booking-card ${b.status}`}>
                <div>
                  <div className="booking-expert">{b.expertName}</div>
                  <div className="booking-meta" style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span>📅 <strong>{formatDate(b.date)}</strong> at <strong>{b.timeSlot}</strong></span>
                    <span>👤 {b.userName} · 📞 {b.phone}</span>
                    {b.notes && <span>📝 {b.notes}</span>}
                    <span style={{ marginTop: 4, fontSize: '0.78rem', opacity: 0.7 }}>
                      Booked {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span className={`status-badge ${b.status}`}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!searched && !loading && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)', marginBottom: 8 }}>Track Your Sessions</h3>
          <p>Enter your email address above to see all your booked expert sessions.</p>
        </div>
      )}
    </div>
  );
}
