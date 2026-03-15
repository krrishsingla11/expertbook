const Expert = require('../models/Expert');

// GET /experts
exports.getExperts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 6 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [experts, total] = await Promise.all([
      Expert.find(query, '-slots').skip(skip).limit(parseInt(limit)).lean(),
      Expert.countDocuments(query),
    ]);

    res.json({
      experts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /experts/:id
exports.getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id).lean();
    if (!expert) return res.status(404).json({ message: 'Expert not found' });
    res.json(expert);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
