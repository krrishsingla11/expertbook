import React from 'react';
import { Link } from 'react-router-dom';

export default function MyBookings() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Your booked sessions</p>
      </div>
      <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
        <h3 style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)', marginBottom: 8 }}>No Bookings Yet</h3>
        <p>Once you book a session, it will appear here.</p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 24 }}>Browse Experts</Link>
      </div>
    </div>
  );
}
