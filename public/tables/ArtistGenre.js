import pool from './DBConnection.js';

export class ArtistGenre {
  constructor({ artist_id, genre_id }) {
    this.artist_id = artist_id;
    this.genre_id = genre_id;
  }

  async insert() {
    try {
      const result = await pool.query(
        `INSERT INTO artist_genre (artist_id, genre_id)
         VALUES ($1, $2) RETURNING id`,
        [this.artist_id, this.genre_id]
      );

      return {
        success: true,
        message: "Artist-genre relationship inserted successfully",
        id: result.rows[0].id
      };
    } catch (error) {
      console.error("Failed to insert artist-genre relationship:", error.message);
      return {
        success: false,
        message: "Failed to insert artist-genre relationship",
        error: error.message
      };
    }
  }

  static async getByArtistId(artist_id) {
    try {
      const result = await pool.query(
        `SELECT ag.*, g.name AS genre_name
         FROM artist_genre ag
         JOIN genre g ON ag.genre_id = g.id
         WHERE ag.artist_id = $1`,
        [artist_id]
      );

      return {
        success: true,
        message: "Genres retrieved for artist",
        genres: result.rows
      };
    } catch (error) {
      console.error("Failed to retrieve genres for artist:", error.message);
      return {
        success: false,
        message: "Failed to retrieve genres",
        error: error.message
      };
    }
  }

  static async getAll() {
    try {
      const result = await pool.query(
        `SELECT ag.*, a.name AS artist_name, g.name AS genre_name
         FROM artist_genre ag
         JOIN artist a ON ag.artist_id = a.id
         JOIN genre g ON ag.genre_id = g.id`
      );

      return {
        success: true,
        message: "All artist-genre relationships retrieved",
        rows: result.rows
      };
    } catch (error) {
      console.error("Failed to retrieve all artist-genre relationships:", error.message);
      return {
        success: false,
        message: "Failed to retrieve all relationships",
        error: error.message
      };
    }
  }
}
