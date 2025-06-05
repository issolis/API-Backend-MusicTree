import pool from './DBConnection.js';

export class MGPCRelation {
  constructor({ genre_a, genre_b, mgpc, influence }) {
    if (genre_a > genre_b) {
      [genre_a, genre_b] = [genre_b, genre_a];
    }

    this.genre_a = genre_a;
    this.genre_b = genre_b;
    this.mgpc = mgpc;
    this.influence = influence;
  }

  async insert() {
    try {
      const query = `
        INSERT INTO mgpc_relation (genre_a, genre_b, mgpc, influence)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `;

      const values = [this.genre_a, this.genre_b, this.mgpc, this.influence];

      const result = await pool.query(query, values);

      console.log("MGPC relation inserted with id:", result.rows[0].id);

      return {
        success: true,
        message: "MGPC relation inserted successfully",
        id: result.rows[0].id
      };
    } catch (error) {
      console.error("Failed to insert MGPC relation:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to insert MGPC relation"
      };
    }
  }

  static async getAll() {
    try {
      const result = await pool.query(`SELECT * FROM mgpc_relation`);
      return {
        success: true,
        message: "MGPC relations fetched",
        rows: result.rows
      };
    } catch (error) {
      console.error("Failed to fetch MGPC relations:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to fetch MGPC relations"
      };
    }
  }
}