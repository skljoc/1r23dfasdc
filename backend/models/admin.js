const pool = require('../config/db');

module.exports = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM admins ORDER BY id');
    return rows;
  },
  async add(email) {
    const { rows } = await pool.query(
      'INSERT INTO admins (email, created_at) VALUES ($1, NOW()) RETURNING *',
      [email]
    );
    return rows[0];
  },
  async remove(email) {
    await pool.query('DELETE FROM admins WHERE email = $1', [email]);
  },
  async isWhitelisted(email) {
    const { rows } = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    return rows.length > 0;
  },
};
