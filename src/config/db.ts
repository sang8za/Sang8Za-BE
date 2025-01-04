import { Pool, PoolClient } from 'pg';
import config from './index';

const { pgHost, pgPort, pgUser, pgPassword, pgDatabase } = config;

const pool = new Pool({
  host: pgHost,
  port: pgPort,
  user: pgUser,
  password: pgPassword,
  database: pgDatabase,
});

pool.on('connect', () => console.log('Database pool connected'));
pool.on('error', (err) =>
  console.error('Unexpected error on idle client', err.stack)
);

export const getConnection = async (): Promise<PoolClient> => {
  try {
    const client = await pool.connect();
    return client;
  } catch (err: any) {
    console.error('Database connection error:', err.stack);
    throw err;
  }
};

export const closeConnection = (client: PoolClient): void => {
  try {
    client.release();
  } catch (err: any) {
    console.error('Error releasing database connection:', err.stack);
  }
};

export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('Database pool closed');
  } catch (err: any) {
    console.error('Error closing database pool:', err.message, err.stack);
  }
};
