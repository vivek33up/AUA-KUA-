// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';
// const db = drizzle(process.env.DATABASE_URL);

// export default db;
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Pool } = pg;

// Use a Pool for better performance in a web server
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export default db;