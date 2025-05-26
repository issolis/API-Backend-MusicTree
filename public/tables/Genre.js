import pool from './DBConnection.js';

export class Genre {
  constructor({
    name,
    description = "",
    is_active = true,
    bpmL = 60,
    bpmU = 60,
    mode,
    metric,
    tone,
    color = "#FFFFFF",
    avrSongDuration,
    is_subgenre = false,
    country,
    creation_year,
    created_date = new Date(),
    volume = 60  
  }) {
    this.name = name;
    this.description = description;
    this.is_active = is_active;
    this.bpmL = bpmL;
    this.bpmU = bpmU;
    this.mode = mode;
    this.metric = metric;
    this.tone = tone;
    this.color = color;
    this.avrSongDuration = avrSongDuration;
    this.is_subgenre = is_subgenre;
    this.country = country;
    this.creation_year = creation_year;
    this.created_date = created_date;
    this.volume = volume;  
  }


  static async generateUniqueId(is_subgenre) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    function generateId() {
      let id = '';
      while (id.length < 12) {
        const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
        if (id.length === 0 || randomChar !== id[id.length - 1]) {
          id += randomChar;
        }
      }
  
      if (is_subgenre === true)
        return 'S-' + id;
      return 'G-' + id;
    }

    let uniqueId;
    let exists = true;

    while (exists) {
      uniqueId = generateId();

      
      const result = await pool.query(
        `SELECT 1 FROM genre WHERE id = $1 LIMIT 1`,
        [uniqueId]
      );

      exists = result.rowCount > 0;
    }

    return uniqueId;
  }

  async insert() {
    try {
      const id = await Genre.generateUniqueId(this.is_subgenre);

      const query = `
        INSERT INTO genre 
        (id, name, description, is_active, bpmL, bpmU, mode, metric, tone,
        color, avrSongDuration, is_subgenre, country, creation_year, created_date, volume)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `;

      const values = [
        id,
        this.name,
        this.description,
        this.is_active,
        this.bpmL,
        this.bpmU,
        this.mode,
        this.metric,
        this.tone,
        this.color,
        this.avrSongDuration,
        this.is_subgenre,
        this.country,
        this.creation_year,
        this.created_date,
        this.volume 
      ];

      await pool.query(query, values);

      console.log("Genre created successfully with id:", id);

      return {
        success: true,
        message: "Genre created successfully",
        id
      };

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

  static async getStatsByName(name) {
    try {
      const query = `
        SELECT bpmU, bpmL, mode, metric, tone, avrSongDuration, volume
        FROM genre
        WHERE name = $1
      `;
      const result = await pool.query(query, [name]);

      if (result.rows.length === 0) {
        return {
          success: false,
          message: `Genre with name '${name}' not found`
        };
      }

      return {
        success: true,
        message: 'Genre statistics retrieved successfully',
        data: result.rows[0]
      };

    } catch (error) {
      console.error("Failed to fetch genre stats by name:", error.message);
      return {
        success: false,
        error: error.message,
        message: "Error fetching genre statistics"
      };
    }
  }

}


