const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { requireMinistryAccess } = require('../middleware/rbac');
const { Ministry, Event, Project, User } = require('../models');

router.get('/:ministryId/dashboard', verifyToken, requireMinistryAccess, async (req, res) => {
  const { ministryId } = req.params;
  try {
    const ministry = await Ministry.findByPk(ministryId);
    if (!ministry) return res.status(404).json({ error: 'Not found' });
    const members = await User.findAll({ where: { ministry_id: ministryId }, attributes: ['id','name','role'] });
    const events = await Event.findAll({ where: { ministry_id: ministryId } });
    const projects = await Project.findAll({ where: { committee_id: ministryId } });
    res.json({ ministry, members, events, projects });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
