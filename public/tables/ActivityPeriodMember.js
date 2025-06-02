import pool from './DBConnection.js';

export class ActivityPeriodMember {
  constructor({ member_id, startp, endp }) {
    this.member_id = member_id;
    this.startp = startp;
    this.endp = endp;
  }

  async insert() {
    try {
      const result = await pool.query(
        `INSERT INTO activity_period_member (member_id, startp, endp)
         VALUES ($1, $2, $3) RETURNING id`,
        [this.member_id, this.startp, this.endp]
      );

      return {
        success: true,
        message: "Activity period for member inserted successfully",
        id: result.rows[0].id
      };
    } catch (error) {
      console.error("Error inserting activity period for member:", error.message);
      return {
        success: false,
        message: "Failed to insert activity period for member",
        error: error.message
      };
    }
  }

  static async getByMemberId(member_id) {
    try {
      const result = await pool.query(
        `SELECT * FROM activity_period_member WHERE member_id = $1`,
        [member_id]
      );

      return {
        success: true,
        message: "Activity periods retrieved for member",
        rows: result.rows
      };
    } catch (error) {
      console.error("Error fetching activity periods for member:", error.message);
      return {
        success: false,
        message: "Failed to fetch activity periods for member",
        error: error.message
      };
    }
  }

  static async getAll() {
    try {
      const result = await pool.query(`SELECT * FROM activity_period_member`);

      return {
        success: true,
        message: "All activity periods for members retrieved",
        rows: result.rows
      };
    } catch (error) {
      console.error("Error fetching all activity periods:", error.message);
      return {
        success: false,
        message: "Failed to fetch all activity periods",
        error: error.message
      };
    }
  }
}
