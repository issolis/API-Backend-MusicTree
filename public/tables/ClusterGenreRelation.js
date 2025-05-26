import pool from './DBConnection.js';

export class ClusterGenreRelation {
  constructor({ cluster_id, genre_id }) {
    this.cluster_id = cluster_id;
    this.genre_id = genre_id;
  }

  async insert() {
    try {
      await pool.query(
        `INSERT INTO cluster_genre_relation (cluster_id, genre_id)
         VALUES ($1, $2)`,
        [this.cluster_id, this.genre_id]
      );
      console.log("Cluster-Genre relation inserted successfully");

      return {
        success: true,
        message: "Cluster-Genre relation inserted successfully"
      };

    } catch (error) {
      console.error("Failed to insert Cluster-Genre relation:", error.message);

      return {
        success: false,
        error: error.message,
        message: "Failed to insert Cluster-Genre relation"
      };
    }
  }

  static async getAll() {
    try {
      const result = await pool.query(`
        SELECT * FROM cluster_genre_relation
      `);

      return {
        success: true,
        message: "Cluster-Genre relations retrieved successfully",
        rows: result.rows
      };

    } catch (error) {
      console.error("Failed to fetch Cluster-Genre relations:", error.message);

      return {
        success: false,
        error: error.message,
        message: "Failed to fetch Cluster-Genre relations"
      };
    }
  }
}
