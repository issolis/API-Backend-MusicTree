import pool from './DBConnection.js';

export class CommentThread {
  constructor({ artist_id }) {
    this.artist_id = artist_id;
  }

  async insert() {
    try {

      const result = await pool.query(
        `INSERT INTO comment_threads (artist_id) VALUES ($1) RETURNING id`,
        [this.artist_id]
      );
      return {
        success: true,
        id: result.rows[0].id
      };
    } catch (error) {

      return {
        success: false,
        error: error.message
      };
    }
  }


  static async getAll() {
    try {
      const result = await pool.query(`SELECT * FROM comment_threads`);
      return {
        success: true,
        message: "All comment threads retrieved",
        rows: result.rows
      };
    } catch (error) {
      console.error("Error fetching comment threads:", error.message);
      return {
        success: false,
        message: "Failed to fetch comment threads",
        error: error.message
      };
    }
  }

  static async getByArtistId(artist_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM comment_threads WHERE artist_id = $1`,
        [artist_id]
      );

      return {
        success: true,
        message: "Comment thread retrieved by artist",
        rows: result.rows
      };
    } catch (error) {
      console.error("Error fetching comment thread by artist ID:", error.message);
      return {
        success: false,
        message: "Failed to fetch comment thread by artist",
        error: error.message
      };
    }
  }
}
