import pool from './DBConnection.js';

export class Cluster {
  constructor({ 
    name, 
    description = "", 
    is_active = true, 
    created_date = new Date() 
  }) {
    this.name = name;
    this.description = description;
    this.is_active = is_active;
    this.created_date = created_date;
  }

  static async generateUniqueId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function randomString(length) {
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    let id;
    let exists = true;

    while (exists) {
      id = 'C-' + randomString(12);
      const res = await pool.query('SELECT 1 FROM cluster WHERE id = $1', [id]);
      exists = res.rows.length > 0;
    }

    return id;
  }

  async insert() {
    try {
      const id = await Cluster.generateUniqueId();
      await pool.query(
        `INSERT INTO cluster (id, name, description, is_active, created_date)
        VALUES ($1, $2, $3, $4, $5)`,
        [id, this.name, this.description, this.is_active, this.created_date]
      );

      console.log("Cluster created successfully with id:", id);

      return {
        success: true,
        message: "Cluster created successfully",
        id
      };

    } catch (error) {
      console.error("Failed to create cluster:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to insert cluster into database"
      };
    }
  }

  

  static async getAll() {
    try {
      const result = {
        success: true,
        message: 'Cluster list obtained',
        rows: (await pool.query(`SELECT * FROM cluster`)).rows
      };
      return result;
    } catch (error) {
      console.error("Failed to fetch clusters:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to fetch clusters from database"
      };
    }
  }
  static async getActive() {
    try {
      const result = {
        success: true,
        message: 'Active clusters obtained',
        rows: (await pool.query(`SELECT * FROM cluster WHERE is_active = true`)).rows
      };
      console.log(result);
      return result;
    } catch (error) {
      console.error("Failed to fetch active clusters:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to fetch active clusters from database"
      };
    }
  }
  static async getIdByName(name) {
    try {
      const result = await pool.query(
        `SELECT id FROM cluster WHERE name = $1`,
        [name]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          message: `No cluster found with name: ${name}`
        };
      }

      return {
        success: true,
        id: result.rows[0].id
      };

    } catch (error) {
      console.error("Failed to get cluster ID by name:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to retrieve cluster ID"
      };
    }
  }
}