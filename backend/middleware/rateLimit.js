const rateLimit = require('express-rate-limit');

const voteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP/device/user to 5 votes per minute
  message: 'Too many voting attempts. Please try again later.'
});

module.exports = voteLimiter;
