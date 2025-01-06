import { withConnection } from '../middlewares/connection';
import { ContractQueries } from './queries';

const createContract = (userId: number, matchId: number) =>
  withConnection(async (db) => {
    const {
      rows: [contract],
    } = await db.query(ContractQueries.QUERY_CREATE_CONTRACT, [matchId]);

    console.log(
      `Contract created by user ${userId}. Originally approval from both sides are needed but we are skipping that for now.`
    );

    return contract;
  });

export default { createContract };
