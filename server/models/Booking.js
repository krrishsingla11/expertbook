const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  expertName: { type: String, required: true },
  userName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
  },
  phone: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

// Compound unique index to prevent double bookings at DB level
bookingSchema.index(
  { expertId: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['Pending', 'Confirmed'] } } }
);

module.exports = mongoose.model('Booking', bookingSchema);
