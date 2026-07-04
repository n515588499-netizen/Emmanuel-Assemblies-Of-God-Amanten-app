function isAdmin(user) {
  return user && user.role === 'admin';
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (!isAdmin(req.user)) return res.status(403).json({ error: 'Admin only' });
  next();
}

function requireMinistryAccess(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (isAdmin(req.user)) return next();
  const ministryId = req.params.ministryId || req.body.ministry_id || req.body.ministryId;
  if (!ministryId) return res.status(400).json({ error: 'Ministry id required' });
  if (req.user.ministry_id !== ministryId) {
    return res.status(403).json({ error: 'Not authorized for this ministry' });
  }
  next();
}

module.exports = {
  isAdmin,
  requireAdmin,
  requireMinistryAccess
};
