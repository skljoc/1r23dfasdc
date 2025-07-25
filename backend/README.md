# Voting App Backend

## Setup

1. Copy `.env.example` to `.env` and fill in your PostgreSQL and admin config.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. For production (Render):
   - Set `DATABASE_URL`, `RESTRICT_ADMIN_IP`, `ADMIN_ALLOWED_IP`, and `ADMIN_EMAIL_WHITELIST` in Render environment variables.
   - Use `npm start` as the Render start command.

## Database
- Requires PostgreSQL. See `models/*.js` for schema.

### Example Schema
```sql
CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  google_user_id TEXT,
  candidate_id INTEGER REFERENCES candidates(id),
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT,
  country TEXT,
  device_fingerprint TEXT
);

CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints
- `/api/candidates` – Manage candidates
- `/api/vote` – Cast vote
- `/api/vote/results` – Public results
- `/api/admin` – Admin tools (protected) 