import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getExpert } from '../utils/api';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function groupSlotsByDate(slots) {
  const groups = {};
  slots.forEach((slot) => {
    if (!groups[slot.date]) groups[slot.date] = [];
    groups[slot.date].push(slot);
  });
  return groups;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newlyBooked, setNewlyBooked] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getExpert(id)
      .then(({ data }) => { if (!cancelled) { setExpert(data); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError('Failed to load expert.'); setLoading(false); } });
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });

    socketRef.current.on('slotBooked', ({ expertId, date, timeSlot }) => {
      if (expertId !== id) return;
      setNewlyBooked(`${date}|${timeSlot}`);
      setTimeout(() => setNewlyBooked(null), 1500);
      setExpert((prev) => {
        if (!prev) return prev;
        const slots = prev.slots.map((s) =>
          s.date === date && s.time === timeSlot ? { ...s, isBooked: true } : s
        );
        return { ...prev, slots };
      });
    });

    socketRef.current.on('slotFreed', ({ expertId, date, timeSlot }) => {
      if (expertId !== id) return;
      setExpert((prev) => {
        if (!prev) return prev;
        const slots = prev.slots.map((s) =>
          s.date === date && s.time === timeSlot ? { ...s, isBooked: false } : s
        );
        return { ...prev, slots };
      });
    });

    return () => socketRef.current?.disconnect();
  }, [id]);

  if (loading) return (
    <div className="page"><div className="loading-wrapper"><div className="spinner" /><p className="loading-text">Loading expert...</p></div></div>
  );
  if (error) return <div className="page"><div className="error-box">⚠ {error}</div></div>;
  if (!expert) return null;

  const slotGroups = groupSlotsByDate(expert.slots || []);
  const dates = Object.keys(slotGroups).sort().slice(0, 10);

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back to Experts</Link>
      <div className="detail-layout">
        {/* LEFT: Expert Info */}
        <div className="expert-detail-card">
          <img
            src={expert.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${expert.name}`}
            alt={expert.name}
            className="expert-detail-avatar"
          />
          <div className="expert-category-badge" style={{ marginBottom: 8 }}>{expert.category}</div>
          <div className="expert-detail-name">{expert.name}</div>
          <div className="expert-detail-bio">{expert.bio}</div>
          <div className="divider" />
          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">Rating</span>
              <span className="stat-value">★ {expert.rating?.toFixed(1)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Experience</span>
              <span className="stat-value">{expert.experience}y</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rate</span>
              <span className="stat-value">${expert.hourlyRate}/hr</span>
            </div>
          </div>
          <div className="skills-list" style={{ marginTop: 8 }}>
            {expert.skills?.map((s) => <span key={s} className="skill-tag">{s}</span>)}
          </div>
          <button
            className="book-btn"
            disabled={!selectedSlot}
            onClick={() => {
              if (selectedSlot) {
                navigate(`/book/${id}`, { state: { expert, slot: selectedSlot } });
              }
            }}
          >
            {selectedSlot ? `Book ${selectedSlot.time}` : 'Select a Time Slot'}
          </button>
          {selectedSlot && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
              {formatDate(selectedSlot.date)} at {selectedSlot.time}
            </p>
          )}
        </div>

        {/* RIGHT: Slots */}
        <div className="slots-panel">
          <h2>Available Time Slots</h2>
          <div className="realtime-badge">
            <span className="realtime-dot" />
            Real-time availability
          </div>

          {dates.length === 0 ? (
            <div className="empty-state"><p>No available slots at this time.</p></div>
          ) : dates.map((date) => (
            <div key={date} className="date-group">
              <div className="date-label">{formatDate(date)}</div>
              <div className="slots-row">
                {slotGroups[date].map((slot) => {
                  const key = `${slot.date}|${slot.time}`;
                  const isSelected = selectedSlot?.date === slot.date && selectedSlot?.time === slot.time;
                  const isNew = newlyBooked === key;
                  return (
                    <button
                      key={slot.time}
                      className={`slot-btn${slot.isBooked ? ' booked' : ''}${isSelected ? ' selected' : ''}${isNew ? ' newly-booked' : ''}`}
                      disabled={slot.isBooked}
                      onClick={() => setSelectedSlot(isSelected ? null : slot)}
                    >
                      {slot.time}
                      {slot.isBooked && ' ✗'}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
