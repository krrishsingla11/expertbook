const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:MM
  isBooked: { type: Boolean, default: false },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
});

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Finance', 'Health', 'Legal', 'Marketing', 'Design', 'Education', 'Business'],
  },
  experience: { type: Number, required: true },
  rating: { type: Number, min: 1, max: 5, default: 4.0 },
  bio: { type: String },
  avatar: { type: String },
  hourlyRate: { type: Number, required: true },
  skills: [String],
  slots: [slotSchema],
}, { timestamps: true });

expertSchema.index({ name: 'text', category: 1 });

module.exports = mongoose.model('Expert', expertSchema);
