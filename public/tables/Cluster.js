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

  async insert() {
    try {
      const result = await pool.query(
        `INSERT INTO cluster 
        (name, description, is_active, created_date)
        VALUES ($1, $2, $3, $4)`,  
        [this.name, this.description, this.is_active, this.created_date]
      );
      console.log("Cluster created successfully");

      return {
        success: true,
        message: "Cluster created successfully"
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


}