const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/rbac');

router.get('/dashboard', verifyToken, requireAdmin, async (req, res) => {
  const { User, Ministry, Event } = require('../models');
  try {
    const userCount = await User.count();
    const ministryCount = await Ministry.count();
    const upcomingEvents = await Event.findAll({ limit: 10, order: [['date', 'ASC']] });
    res.json({ userCount, ministryCount, upcomingEvents });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
