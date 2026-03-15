const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

// POST /bookings
exports.createBooking = async (req, res) => {
  try {
    const { expertId, userName, email, phone, date, timeSlot, notes } = req.body;

    // Atomically find the expert and mark the slot as booked in ONE operation.
    // The query conditions ensure we only update if the slot EXISTS and is NOT already booked.
    // This prevents race conditions without needing replica set transactions.
    const updated = await Expert.findOneAndUpdate(
      {
        _id: expertId,
        slots: { $elemMatch: { date, time: timeSlot, isBooked: false } },
      },
      {
        $set: { 'slots.$.isBooked': true },
      },
      { new: true }
    );

    // If no document was updated, slot is taken or doesn't exist
    if (!updated) {
      const expert = await Expert.findById(expertId).lean();
      if (!expert) return res.status(404).json({ message: 'Expert not found' });

      const slot = expert.slots.find((s) => s.date === date && s.time === timeSlot);
      if (!slot) return res.status(400).json({ message: 'Time slot not found' });
      if (slot.isBooked) return res.status(409).json({ message: 'This time slot is already booked. Please choose another.' });

      return res.status(400).json({ message: 'Could not reserve slot. Please try again.' });
    }

    // Create the booking record
    const booking = await Booking.create({
      expertId,
      expertName: updated.name,
      userName,
      email,
      phone,
      date,
      timeSlot,
      notes,
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This slot is already booked.' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PATCH /bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // If cancelled, free up the slot
    if (status === 'Cancelled') {
      await Expert.updateOne(
        { _id: booking.expertId, 'slots.date': booking.date, 'slots.time': booking.timeSlot },
        { $set: { 'slots.$.isBooked': false, 'slots.$.bookingId': null } }
      );
    }

    res.json({ message: 'Status updated', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /bookings?email=
exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const bookings = await Booking.find({ email: email.toLowerCase() })
      .sort({ createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
