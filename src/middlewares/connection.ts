import { PoolClient } from 'pg';
import { getConnection, closeConnection } from '../config/db';

export const withConnection = async <T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await getConnection();
  try {
    return await fn(client);
  } finally {
    closeConnection(client);
  }
};
