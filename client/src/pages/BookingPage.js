import React, { useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function validate(form) {
  const errors = {};
  if (!form.userName.trim()) errors.userName = 'Name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Valid email required';
  if (!form.phone.trim()) errors.phone = 'Phone is required';
  else if (!/^[\d\s\-\+\(\)]{7,15}$/.test(form.phone)) errors.phone = 'Valid phone required';
  return errors;
}

export default function BookingPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const expert = state?.expert;
  const slot = state?.slot;

  const [form, setForm] = useState({ userName: '', email: '', phone: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!expert || !slot) {
    return (
      <div className="page">
        <div className="error-box">⚠ Missing booking information. Please go back and select a slot.</div>
        <Link to={`/experts/${id}`} className="back-link" style={{ marginTop: 16 }}>← Back to Expert</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    // Simulate a short delay then show success
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="page">
      <Link to={`/experts/${expert._id}`} className="back-link">← Back to Expert</Link>
      <div className="page-header">
        <h1>Complete Your Booking</h1>
        <p>You're booking a session with {expert.name}</p>
      </div>

      <div className="booking-layout">
        <div className="booking-form-card">
          <h2>Your Information</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className={`form-input${errors.userName ? ' error' : ''}`} type="text" name="userName" placeholder="John Doe" value={form.userName} onChange={handleChange} />
                {errors.userName && <span className="field-error">{errors.userName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className={`form-input${errors.email ? ' error' : ''}`} type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input className={`form-input${errors.phone ? ' error' : ''}`} type="tel" name="phone" placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="text" value={formatDate(slot.date)} readOnly style={{ background: 'var(--surface-2)', cursor: 'default' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <input className="form-input" type="text" value={slot.time} readOnly style={{ background: 'var(--surface-2)', cursor: 'default' }} />
              </div>
              <div className="form-group full">
                <label className="form-label">Notes (Optional)</label>
                <textarea className="form-textarea" name="notes" placeholder="What would you like to discuss?" value={form.notes} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Booking...</> : '✓ Confirm Booking'}
            </button>
          </form>
        </div>

        <div className="booking-summary-card">
          <h3>Booking Summary</h3>
          <div className="summary-item"><span className="summary-label">Expert</span><span className="summary-value">{expert.name}</span></div>
          <div className="summary-item"><span className="summary-label">Category</span><span className="summary-value">{expert.category}</span></div>
          <div className="summary-item"><span className="summary-label">Date</span><span className="summary-value">{formatDate(slot.date)}</span></div>
          <div className="summary-item"><span className="summary-label">Time</span><span className="summary-value">{slot.time}</span></div>
          <div className="summary-item"><span className="summary-label">Duration</span><span className="summary-value">1 hour</span></div>
          <div className="divider" />
          <div className="summary-total"><span>Total</span><span>${expert.hourlyRate}</span></div>
          <div style={{ marginTop: 16, padding: 12, background: 'var(--surface-2)', borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            ℹ️ You'll receive a confirmation email with meeting details once the booking is confirmed.
          </div>
        </div>
      </div>

      {success && (
        <div className="success-overlay" onClick={() => navigate('/')}>
          <div className="success-card" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">🎉</div>
            <h2>Booking Confirmed!</h2>
            <p>Your session with <strong>{expert.name}</strong> on {formatDate(slot.date)} at {slot.time} has been successfully booked.</p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/')}>Browse More Experts</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
