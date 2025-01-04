//router index file
import { Router } from 'express';
import { getConnection, closeConnection } from '../config/db';

const router = Router();

router.get('/temp', async (req, res) => {
  const db = await getConnection();
  try {
    const { rows } = await db.query('SELECT NOW()');
    res.json(rows);
  } catch (err: any) {
    console.error('Error executing query:', err.stack);
  } finally {
    closeConnection(db);
  }
});

export default router;
