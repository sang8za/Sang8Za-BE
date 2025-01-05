export default {
  QUERY_CREATE_TENANT_SWIPE: `
    INSERT INTO tenant_swipes (tenant_id, property_id, is_positive)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
  QUERY_GET_LANDLORD_SWIPE: `
    SELECT ls.id
    FROM landlord_swipes ls
    JOIN properties p ON p.landlord_id = ls.landlord_id
    WHERE ls.tenant_id = $1
      AND p.id = $2
      AND ls.is_positive IS TRUE
  `,
  CREATE_MATCH: `
    INSERT INTO matches (tenant_swipe, landlord_swipe)
    VALUES ($1, $2)
    RETURNING *
  `,
};
