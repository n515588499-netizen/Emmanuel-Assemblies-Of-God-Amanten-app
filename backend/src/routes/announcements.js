const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { Announcement } = require('../models');
const { emitAnnouncement } = require('../services/broadcast');

router.post('/', verifyToken, async (req, res) => {
  const user = req.user;
  const { target_audience, target_value, content } = req.body;

  if (!target_audience || !content) return res.status(400).json({ error: 'target_audience and content required' });

  if (user.role !== 'admin') {
    if (target_audience === 'all' || target_audience === 'role') {
      return res.status(403).json({ error: 'Only admins may broadcast to all or to roles' });
    }
    if (target_audience === 'ministry') {
      if (!user.ministry_id || user.ministry_id !== target_value) {
        return res.status(403).json({ error: 'Not authorized to post for this ministry' });
      }
    }
    if (target_audience === 'user') {
      if (user.id !== target_value) {
        return res.status(403).json({ error: 'Not authorized to post for this user' });
      }
    }
  }

  try {
    const announcement = await Announcement.create({
      target_audience,
      target_value: target_value || null,
      content,
      created_by: user.id
    });

    emitAnnouncement(announcement);

    res.json(announcement);
  } catch (err) {
    console.error('Announcement creation error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
