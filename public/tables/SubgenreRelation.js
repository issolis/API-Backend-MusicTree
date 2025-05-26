import pool from './DBConnection.js';

export class SubgenreRelation {
  constructor({ parent, child }) {
    this.parent = parent;
    this.child = child;
  }

  async insert() {
    try {
      const result = await pool.query(
        `INSERT INTO subgenre_relation (parent, child) 
         VALUES ($1, $2)`,
        [this.parent, this.child]
      );
      console.log("Subgenre relation created successfully");
      return {
        success: true,
        message: "Subgenre relation created successfully"
      };
    } catch (error) {
      console.error("Failed to create subgenre relation:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to insert subgenre relation into database"
      };
    }
  }

  static async getAll() {
    try {
      const result = await pool.query(`
        SELECT 
          sr.id, 
          sr.parent, 
          gp.name AS parent_name, 
          sr.child, 
          gc.name AS child_name
        FROM subgenre_relation sr
        JOIN genre gp ON sr.parent = gp.id
        JOIN genre gc ON sr.child = gc.id
      `);
      return {
        success: true,
        message: 'Subgenre relations obtained',
        rows: result.rows
      };
    } catch (error) {
      console.error("Failed to fetch subgenre relations:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to fetch subgenre relations"
      };
    }
  }
}
