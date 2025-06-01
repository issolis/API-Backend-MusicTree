import { ID } from '../Calculatations/ID.js';
import pool from './DBConnection.js';
import { CommentThread } from './CommentThread.js'; 
import { PhotoAlbum } from './PhotoAlbum.js';
import { Calendar } from './Calendar.js';

export class Artist {
  constructor({ 
    name, 
    biography = "", 
    country = "", 
    active = true, 
    urlCover = "", 
    date = new Date() 
  }) {
    this.name = name;
    this.biography = biography;
    this.country = country;
    this.active = active;
    this.urlCover = urlCover;
    this.date = date;
  }

  async insert() {
    try {
      const id = await ID.generateUniqueId('A', 'artist');

      await pool.query(
        `INSERT INTO artist (id, name, biography, country, date, active, urlcover)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, this.name, this.biography, this.country, this.date, this.active, this.urlCover]
      );

      const threadResult = await new CommentThread({ artist_id: id }).insert();
      if (!threadResult.success) {
        console.warn('Comment thread creation failed:', threadResult.message);
      }

      const pAlbumResult = await new PhotoAlbum({ artist_id: id }).insert();
      if (!pAlbumResult.success) {
        console.warn('PhotoAlbum creation failed:', pAlbumResult.message);
      }

      const calendarResult = await new Calendar({ artist_id: id }).insert();
      if (!calendarResult.success) {
        console.warn('Calendar creation failed:', calendarResult.message);
      }

      return {
        success: true,
        message: "Artist inserted; related comment thread, photo album, and calendar insert attempted",
        id
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to insert artist",
        error: error.message
      };
    }
  }


  static async getAll() {
    try {
      const result = await pool.query(`SELECT * FROM artist ORDER BY date DESC`);
      return {
        success: true,
        message: 'Artist list obtained',
        rows: result.rows
      };
    } catch (error) {
      console.error("Failed to fetch artists:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to fetch artists from database"
      };
    }
  }

  static async getActive() {
    try {
      const result = await pool.query(`SELECT * FROM artist WHERE active = true`);
      return {
        success: true,
        message: 'Active artists obtained',
        rows: result.rows
      };
    } catch (error) {
      console.error("Failed to fetch active artists:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to fetch active artists from database"
      };
    }
  }

  static async getIdByName(name) {
    try {
      const result = await pool.query(
        `SELECT id FROM artist WHERE name = $1 LIMIT 1`,
        [name]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          message: `No artist found with name: ${name}`
        };
      }

      return {
        success: true,
        id: result.rows[0].id
      };

    } catch (error) {
      console.error("Failed to get artist ID by name:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to retrieve artist ID"
      };
    }
  }
}
