const pool = require('../config/db');

module.exports = {
  async add(vote) {
    const {
      google_user_id,
      candidate_id,
      ip_address,
      user_agent,
      browser,
      os,
      device_type,
      country,
      device_fingerprint,
    } = vote;
    const { rows } = await pool.query(
      `INSERT INTO votes
        (google_user_id, candidate_id, timestamp, ip_address, user_agent, browser, os, device_type, country, device_fingerprint)
       VALUES ($1, $2, NOW(), $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        google_user_id,
        candidate_id,
        ip_address,
        user_agent,
        browser,
        os,
        device_type,
        country,
        device_fingerprint,
      ]
    );
    return rows[0];
  },
  async getResults() {
    const { rows } = await pool.query(
      'SELECT candidate_id, COUNT(*) as votes FROM votes GROUP BY candidate_id ORDER BY candidate_id'
    );
    return rows;
  },
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM votes ORDER BY timestamp DESC');
    return rows;
  },
  async checkDuplicate({ google_user_id, device_fingerprint }) {
    const { rows } = await pool.query(
      'SELECT * FROM votes WHERE google_user_id = $1 OR device_fingerprint = $2',
      [google_user_id, device_fingerprint]
    );
    return rows.length > 0;
  },
};
