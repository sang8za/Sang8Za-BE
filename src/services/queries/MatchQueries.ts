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
  QUERY_CREATE_LANDLORD_SWIPE: `
    INSERT INTO landlord_swipes (landlord_id, tenant_id, is_positive)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
  QUERY_GET_TENANT_SWIPE: `
    SELECT ts.id
    FROM tenant_swipes ts
    JOIN properties p ON p.id = ts.property_id
    WHERE p.landlord_id = $1
      AND ts.tenant_id = $2
      AND ts.is_positive IS TRUE
  `,
  GET_MATCHES_BY_USER_ID: `
    SELECT
      m.*,
      CASE 
        WHEN c.id IS NOT NULL THEN TRUE
        ELSE FALSE
      END AS is_contracted
    FROM matches m
    LEFT JOIN contracts c ON c.match_id = m.id
    WHERE m.tenant_swipe IN (SELECT id FROM tenant_swipes WHERE tenant_id = $1)
      OR m.landlord_swipe IN (SELECT id FROM landlord_swipes WHERE landlord_id = $1)
  `,
  GET_MATCHED_PROPERTIES: `
    SELECT
      m.id AS match_id,
      p.*
    FROM properties p
    JOIN tenant_swipes ts ON ts.property_id = p.id
    JOIN matches m ON m.tenant_swipe = ts.id
    WHERE m.id = ANY($1)
  `,
};
