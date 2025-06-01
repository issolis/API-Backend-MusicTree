import pool from './DBConnection.js';

export class Member {
  constructor({ artist_id, name, last_name1, last_name2 = null, instrument = null, is_active = true }) {
    this.artist_id = artist_id;
    this.name = name;
    this.last_name1 = last_name1;
    this.last_name2 = last_name2;
    this.instrument = instrument;
    this.is_active = is_active;
  }

  async insert() {
    try {
      const result = await pool.query(
        `INSERT INTO member (artist_id, name, last_name1, last_name2, instrument, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [this.artist_id, this.name, this.last_name1, this.last_name2, this.instrument, this.is_active]
      );
      return {
        success: true,
        message: 'Member created successfully',
        id: result.rows[0].id
      };
    } catch (error) {
      console.error('Failed to create member:', error.message);
      return {
        success: false,
        message: 'Failed to insert member',
        error: error.message
      };
    }
  }

  static async getAll() {
    try {
      const result = await pool.query(`SELECT * FROM member ORDER BY id`);
      return {
        success: true,
        message: 'Members retrieved successfully',
        rows: result.rows
      };
    } catch (error) {
      console.error('Failed to retrieve members:', error.message);
      return {
        success: false,
        message: 'Failed to fetch members',
        error: error.message
      };
    }
  }

  static async getByArtistId(artist_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM member WHERE artist_id = $1 ORDER BY id`,
        [artist_id]
      );
      return {
        success: true,
        message: 'Members by artist retrieved successfully',
        rows: result.rows
      };
    } catch (error) {
      console.error('Failed to retrieve members by artist:', error.message);
      return {
        success: false,
        message: 'Failed to fetch members by artist',
        error: error.message
      };
    }
  }
}
