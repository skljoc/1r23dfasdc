const pool = require('../config/db');

module.exports = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM candidates ORDER BY id');
    return rows;
  },
  async add({ name, photo_url }) {
    const { rows } = await pool.query(
      'INSERT INTO candidates (name, photo_url, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [name, photo_url]
    );
    return rows[0];
  },
  async update(id, { name, photo_url }) {
    const { rows } = await pool.query(
      'UPDATE candidates SET name = $1, photo_url = $2 WHERE id = $3 RETURNING *',
      [name, photo_url, id]
    );
    return rows[0];
  },
  async delete(id) {
    await pool.query('DELETE FROM candidates WHERE id = $1', [id]);
  },
};
