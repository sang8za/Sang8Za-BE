import { withConnection } from '../middlewares/connection';
import { UserQueries } from './queries';

const getUserById = (id: number) =>
  withConnection(async (db) => {
    const {
      rows: [user],
    } = await db.query(UserQueries.QUERY_GET_USER_BY_ID, [id]);
    return user;
  });

export default { getUserById };
