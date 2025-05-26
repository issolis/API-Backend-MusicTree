import pool from './DBConnection.js';

export class Genre {
  constructor({
    name,
    description = '',
    is_active = true,
    bpm = null,
    mode = null,
    metric = null,
    tone = null,
    colorR = 0,
    colorG = 0,
    colorB = 0,
    is_subgenre = false,
    country = '',
    creation_year = null
  }) {
    this.name = name;
    this.description = description;
    this.is_active = is_active;
    this.bpm = bpm;
    this.mode = mode;
    this.metric = metric;
    this.tone = tone;
    this.colorR = colorR;
    this.colorG = colorG;
    this.colorB = colorB;
    this.is_subgenre = is_subgenre;
    this.country = country;
    this.creation_year = creation_year;
    this.created_date = new Date();
  }

  async insert() {
    try {
      const query = `
        INSERT INTO genre 
        (name, description, is_active, bpm, mode, metric, tone, 
         colorR, colorG, colorB, is_subgenre, country, creation_year, created_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `;
      const values = [
        this.name, this.description, this.is_active, this.bpm, this.mode,
        this.metric, this.tone, this.colorR, this.colorG, this.colorB,
        this.is_subgenre, this.country, this.creation_year, this.created_date
      ];

      await pool.query(query, values);

      console.log("Genre created successfully");
      return { success: true, message: "Genre created successfully" };

    } catch (error) {
      console.error("Failed to create genre:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to insert genre into database"
      };
    }
  }

  static async getAll() {
    try {
      const result = await pool.query(`SELECT * FROM genre`);
      return {
        success: true,
        message: 'Genre list obtained',
        rows: result.rows
      };
    } catch (error) {
      console.error("Failed to fetch genres:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to fetch genre list"
      };
    }
  }

  static async getActive() {
    try {
      const result = await pool.query(`SELECT * FROM genre WHERE is_active = true`);
      return {
        success: true,
        message: 'Active genres obtained',
        rows: result.rows
      };
    } catch (error) {
      console.error("Failed to fetch active genres:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Failed to fetch active genre list"
      };
    }
  }

  static async getParents() {
    try {
        const result = {
        success: true,
        message: 'Active main genres retrieved',
        rows: (await pool.query(`
            SELECT * FROM genre 
            WHERE is_subgenre = false
        `)).rows
        };
        console.log(result);
        return result;
    } catch (error) {
        console.error("Failed to fetch  main genres:", error.message);
        return {
        success: false,
        error: error.message,
        message: "Failed to fetch  main genres from database"
        };
    }
  }

  static async getActiveParents() {
    try {
        const result = {
        success: true,
        message: 'Active main genres retrieved',
        rows: (await pool.query(`
            SELECT * FROM genre 
            WHERE is_active = true AND is_subgenre = false
        `)).rows
        };
        console.log(result);
        return result;
    } catch (error) {
        console.error("Failed to fetch active main genres:", error.message);
        return {
        success: false,
        error: error.message,
        message: "Failed to fetch active main genres from database"
        };
    }
  }

  static async getChilds() {
    try {
        const result = {
        success: true,
        message: 'Active main genres retrieved',
        rows: (await pool.query(`
            SELECT * FROM genre 
            WHERE is_subgenre = true
        `)).rows
        };
        console.log(result);
        return result;
    } catch (error) {
        console.error("Failed to fetch  main genres:", error.message);
        return {
        success: false,
        error: error.message,
        message: "Failed to fetch  main genres from database"
        };
    }
  }

  static async getActiveChilds() {
    try {
        const result = {
        success: true,
        message: 'Active main genres retrieved',
        rows: (await pool.query(`
            SELECT * FROM genre 
            WHERE is_active = true AND is_subgenre = true
        `)).rows
        };
        console.log(result);
        return result;
    } catch (error) {
        console.error("Failed to fetch active main genres:", error.message);
        return {
        success: false,
        error: error.message,
        message: "Failed to fetch active main genres from database"
        };
    }
  }

  static async getIdByName(name) {
  try {
    const result = await pool.query(
      `SELECT id FROM genre WHERE name = $1`,
      [name]
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: `No genre found with name '${name}'`
      };
    }

    return {
      success: true,
      message: "Genre ID obtained successfully",
      id: result.rows[0].id
    };
  } catch (error) {
    console.error("Failed to get genre ID by name:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to get genre ID by name"
    };
  }
}


}


