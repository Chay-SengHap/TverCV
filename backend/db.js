import {Pool} from 'pg'


export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})
const testConnection = async () => {
  console.log(process.env.DATABASE_URL)
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('PostgreSQL Connected Successfully!');
    console.log('Database Time:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('Database connection failed!');
    console.error('Error details:', error.message);
  }
};

testConnection();