const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createBooking, updateBookingStatus, getBookingsByEmail } = require('../controllers/bookingController');

const validateBooking = [
  body('expertId').notEmpty().withMessage('Expert ID is required'),
  body('userName').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('timeSlot').notEmpty().withMessage('Time slot is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    next();
  },
];

router.post('/', validateBooking, createBooking);
router.patch('/:id/status', updateBookingStatus);
router.get('/', getBookingsByEmail);

module.exports = router;
