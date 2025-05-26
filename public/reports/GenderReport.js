import pool from '../tables/DBConnection.js';

export class GenderReport {
  static async getAllWithRelations() {
    try {
      const result = await pool.query('SELECT * FROM get_all_genres_with_relations()');

      const results = result.rows.map(genre => ({
        name: genre.name,
        description: genre.description,
        active: genre.active,
        color: genre.color,
        creation_year: genre.creation_year,
        origin_country: genre.origin_country,
        mode: genre.mode,
        bpm: genre.bpm,  // objeto { min, max }
        dominant_tone: genre.dominant_tone,
        typical_volume_db: genre.typical_volume_db,
        time_signature: genre.time_signature,
        average_duration_seconds: genre.average_duration_seconds,
        is_subgenre: genre.is_subgenre,
        parent_genre: genre.parent_genre,
        related_genres: genre.related_genres || []
      }));

      return {
        success: true,
        message: "All genres with relations retrieved",
        data: results
      };

    } catch (error) {
      console.error("Error fetching all genres with relations:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to fetch genres with relations"
      };
    }
  }
}
