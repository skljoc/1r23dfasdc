# Voting App Frontend

## Setup

1. Copy `.env.example` to `.env` and fill in your Google OAuth and backend API config.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. For production (Render):
   - Set `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BACKEND_API_URL`, and `ADMIN_EMAIL_WHITELIST` in Render environment variables.
   - Use `npm run build` and `npm start` as the Render build/start commands. asd
