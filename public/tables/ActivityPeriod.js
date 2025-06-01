import pool from './DBConnection.js';

export class ActivityPeriod {
  constructor({ 
    startP, 
    endP, 
    artist_id 
  }) {
    this.startP = startP;
    this.endP = endP;
    this.artist_id = artist_id;
  }

  async insert() {
    try {
      const result = await pool.query(
        `INSERT INTO activityPeriod (startP, endP, artist_id)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [this.startP, this.endP, this.artist_id]
      );

      const id = result.rows[0].id;

      console.log("Activity period created with ID:", id);

      return {
        success: true,
        message: "Activity period inserted successfully",
        id
      };

    } catch (error) {
      console.error("Failed to insert activity period:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to insert activity period into database"
      };
    }
  }

  static async getByArtistId(artist_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM activityPeriod WHERE artist_id = $1 ORDER BY startP`,
        [artist_id]
      );

      return {
        success: true,
        message: 'Activity periods fetched successfully',
        rows: result.rows
      };

    } catch (error) {
      console.error("Failed to fetch activity periods:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to fetch activity periods from database"
      };
    }
  }
}
