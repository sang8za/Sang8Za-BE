import { withConnection } from '../middlewares/connection';
import { MatchQueries } from './queries';

const createTenantSwipe = (
  userId: number,
  propertyId: number,
  isPositive: boolean
) =>
  withConnection(async (db) => {
    const {
      rows: [tenantSwipe],
    } = await db.query(MatchQueries.QUERY_CREATE_TENANT_SWIPE, [
      userId,
      propertyId,
      isPositive,
    ]);

    if (!isPositive) return { row: tenantSwipe, isMatched: false }; // if tenant swiped left, no need to check landlord swipe

    const landlordSwipe = await checkLandlordSwipe(userId, propertyId);
    if (!landlordSwipe) return { row: tenantSwipe, isMatched: false };

    const match = await createMatch(tenantSwipe.id, landlordSwipe.id); // if landlord swiped right, create a match
    return { row: match, isMatched: true };
  });

const checkLandlordSwipe = (tenantId: number, propertyId: number) =>
  withConnection(async (db) => {
    const {
      rows: [landlordSwipe],
    } = await db.query(MatchQueries.QUERY_GET_LANDLORD_SWIPE, [
      tenantId,
      propertyId,
    ]);
    return landlordSwipe;
  });

const createMatch = (tenantSwipeId: number, landlordSwipeId: number) =>
  withConnection(async (db) => {
    const {
      rows: [match],
    } = await db.query(MatchQueries.CREATE_MATCH, [
      tenantSwipeId,
      landlordSwipeId,
    ]);
    return match;
  });

export default { createTenantSwipe };
