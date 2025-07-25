require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const useragent = require('useragent');

const candidateRoutes = require('./routes/candidate');
const voteRoutes = require('./routes/vote');
const adminRoutes = require('./routes/admin');

const app = express();

// Language middleware
app.use((req, res, next) => {
  let lang = req.headers['x-lang'] || req.query.lang || 'mk';
  if (typeof lang === 'string' && (lang === 'en' || lang === 'mk')) {
    req.lang = lang;
  } else {
    req.lang = 'mk';
  }
  next();
});

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting (basic, can be customized)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
});
app.use(limiter);

// User agent parsing
app.use((req, res, next) => {
  req.useragent = useragent.parse(req.headers['user-agent']);
  next();
});

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Voting backend API running.');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
