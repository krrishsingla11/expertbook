import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getExpertById } from '../data/experts';

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
  const expert = getExpertById(id);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState({});

  if (!expert) return (
    <div className="page">
      <div className="error-box">⚠ Expert not found.</div>
      <Link to="/" className="back-link" style={{ marginTop: 16 }}>← Back to Experts</Link>
    </div>
  );

  const slots = expert.slots.map((s) => ({
    ...s,
    isBooked: bookedSlots[`${s.date}|${s.time}`] || s.isBooked,
  }));

  const slotGroups = groupSlotsByDate(slots);
  const dates = Object.keys(slotGroups).sort().slice(0, 10);

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back to Experts</Link>
      <div className="detail-layout">
        <div className="expert-detail-card">
          <img src={expert.avatar} alt={expert.name} className="expert-detail-avatar" />
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
                navigate(`/book/${id}`, { state: { expert, slot: selectedSlot, onBooked: true } });
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

        <div className="slots-panel">
          <h2>Available Time Slots</h2>
          {dates.length === 0 ? (
            <div className="empty-state"><p>No available slots at this time.</p></div>
          ) : dates.map((date) => (
            <div key={date} className="date-group">
              <div className="date-label">{formatDate(date)}</div>
              <div className="slots-row">
                {slotGroups[date].map((slot) => {
                  const isSelected = selectedSlot?.date === slot.date && selectedSlot?.time === slot.time;
                  return (
                    <button
                      key={slot.time}
                      className={`slot-btn${slot.isBooked ? ' booked' : ''}${isSelected ? ' selected' : ''}`}
                      disabled={slot.isBooked}
                      onClick={() => setSelectedSlot(isSelected ? null : slot)}
                    >
                      {slot.time}{slot.isBooked && ' ✗'}
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
