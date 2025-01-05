import { withConnection } from '../middlewares/connection';
import { UserQueries } from './queries';

const getUserById = (id: number) =>
  withConnection(async (db) => {
    const {
      rows: [user],
    } = await db.query(UserQueries.QUERY_GET_USER_BY_ID, [id]);
    return user;
  });

const getList = (isLimited: boolean) =>
  withConnection(async (db) => {
    const { rows: users } = await db.query(UserQueries.QUERY_GET_USER_LIST);
    if (isLimited) {
      const tenant = users.find(
        ({
          id,
          name,
          type,
          image_url,
        }: {
          id: number;
          name: string;
          type: string;
          image_url: string;
        }) => type === 'tenant'
      );
      const landlord = users.find(
        ({
          id,
          name,
          type,
          image_url,
        }: {
          id: number;
          name: string;
          type: string;
          image_url: string;
        }) => type === 'landlord'
      );
      return [tenant, landlord];
    }
    return users;
  });

export default { getUserById, getList };
