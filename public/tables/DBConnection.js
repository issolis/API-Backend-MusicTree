import { Pool } from 'pg';

const pool = new Pool({
  user: 'db_musictree',
  host: 'dpg-d0ns9lgdl3ps73dqeq30-a.oregon-postgres.render.com',
  database: 'db_musictree_9hik',
  password: 'HuOaxn7mr3NQfOUJK4cQniNNKDopEdNv',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

export default pool;