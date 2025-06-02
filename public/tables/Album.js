import { ID } from '../Calculations/ID.js';
import pool from './DBConnection.js';

export class Album {
  constructor({ 
    title, 
    release_date = null, 
    duration = null, 
    url_cover = "", 
    artist_id 
  }) {
    this.title = title;
    this.release_date = release_date;
    this.duration = duration;
    this.url_cover = url_cover;
    this.artist_id = artist_id;
  }

  async insert() {
    try {
      const id = this.artist_id + "-" + await ID.generateUniqueId('D', 'album');
      await pool.query(
        `INSERT INTO album (id, title, release_date, duration, url_cover, artist_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, this.title, this.release_date, this.duration, this.url_cover, this.artist_id]
      );

      console.log("Album inserted with id:", id);

      return {
        success: true,
        message: "Album inserted successfully",
        id
      };

    } catch (error) {
      console.error("Error inserting album:", error.message);
      return {
        success: false,
        message: "Failed to insert album",
        error: error.message
      };
    }
  }

  static async getAll() {
    try {
      const result = await pool.query(`SELECT * FROM album`);
      return {
        success: true,
        message: "Albums retrieved successfully",
        rows: result.rows
      };
    } catch (error) {
      console.error("Error fetching albums:", error.message);
      return {
        success: false,
        message: "Failed to fetch albums",
        error: error.message
      };
    }
  }

  static async getByArtistId(artist_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM album WHERE artist_id = $1`,
        [artist_id]
      );
      return {
        success: true,
        message: "Albums for artist retrieved",
        rows: result.rows
      };
    } catch (error) {
      console.error("Error fetching albums by artist:", error.message);
      return {
        success: false,
        message: "Failed to fetch albums by artist",
        error: error.message
      };
    }
  }
}
