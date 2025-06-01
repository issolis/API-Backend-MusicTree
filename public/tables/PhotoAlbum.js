import pool from './DBConnection.js';

export class PhotoAlbum {
  constructor({ artist_id }) {
    this.artist_id = artist_id;
  }

  async insert() {
    try {
      const result = await pool.query(
        `INSERT INTO photo_albums (artist_id) VALUES ($1) RETURNING id`,
        [this.artist_id]
      );
      const id = result.rows[0].id;

      return {
        success: true,
        message: "Photo album created successfully",
        id
      };
    } catch (error) {
      console.error("Failed to create photo album:", error.message);
      return {
        success: false,
        message: "Failed to insert photo album",
        error: error.message
      };
    }
  }

  static async getByArtistId(artist_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM photo_albums WHERE artist_id = $1`,
        [artist_id]
      );

      return {
        success: true,
        message: "Photo albums retrieved",
        rows: result.rows
      };
    } catch (error) {
      console.error("Failed to fetch photo albums:", error.message);
      return {
        success: false,
        message: "Failed to fetch photo albums",
        error: error.message
      };
    }
  }
  static async getAll() {
    try {
      const result = await pool.query(`SELECT * FROM photo_albums`);
      return {
        success: true,
        message: "All photo albums retrieved",
        rows: result.rows
      };
    } catch (error) {
      console.error("Failed to fetch all photo albums:", error.message);
      return {
        success: false,
        message: "Failed to fetch all photo albums",
        error: error.message
      };
    }
  }
}
