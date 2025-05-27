import pool from '../tables/DBConnection.js';

export class ID{
    static async generateUniqueId(fLetter, table) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function randomString(length) {
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    let id;
    let exists = true;

    while (exists) {
      id = fLetter + '-' + randomString(12);
      const res = await pool.query('SELECT 1 FROM ' + table + ' WHERE id = $1', [id]);
      exists = res.rows.length > 0;
    }

    return id;
  }
}