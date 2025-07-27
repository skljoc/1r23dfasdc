module.exports = function (req, res, next) {
  if (process.env.RESTRICT_ADMIN_IP === 'true') {
    const allowedIp = process.env.ADMIN_ALLOWED_IP;
    const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (!reqIp.includes(allowedIp)) {
      return res.status(403).json({ error: 'Admin access restricted by IP.' });
    }
  }
  next();
};
