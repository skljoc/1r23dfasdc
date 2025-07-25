// Placeholder: In production, verify Google token and check email whitelist
module.exports = function (req, res, next) {
  const emailWhitelist = (process.env.ADMIN_EMAIL_WHITELIST || '').split(',');
  const userEmail = req.headers['x-user-email']; // To be set by frontend after Google login
  if (!userEmail || !emailWhitelist.includes(userEmail)) {
    return res.status(403).json({ error: 'Admin access denied.' });
  }
  next();
};
