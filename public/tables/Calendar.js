import pool from './DBConnection.js';

export class Calendar {
  constructor({ artist_id }) {
    this.artist_id = artist_id;
  }

  async insert() {
    try {
      const result = await pool.query(
        `INSERT INTO calendar (artist_id) VALUES ($1) RETURNING id`,
        [this.artist_id]
      );
      const id = result.rows[0].id;
      return {
        success: true,
        message: "Calendar created successfully",
        id
      };
    } catch (error) {
      console.error("Failed to create calendar:", error.message);
      return {
        success: false,
        message: "Failed to insert calendar",
        error: error.message
      };
    }
  }

  static async getAll() {
    try {
      const result = await pool.query(`SELECT * FROM calendar`);
      return {
        success: true,
        message: "Calendars retrieved successfully",
        rows: result.rows
      };
    } catch (error) {
      console.error("Failed to fetch calendars:", error.message);
      return {
        success: false,
        message: "Failed to fetch calendars",
        error: error.message
      };
    }
  }

  static async getByArtistId(artist_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM calendar WHERE artist_id = $1`,
        [artist_id]
      );
      return {
        success: true,
        message: "Calendars for artist retrieved",
        rows: result.rows
      };
    } catch (error) {
      console.error("Failed to fetch calendars by artist:", error.message);
      return {
        success: false,
        message: "Failed to fetch calendars by artist",
        error: error.message
      };
    }
  }
}
