export default {
  QUERY_GET_PROPERTY_LIST: (baseFilters: string) => `
    WITH user_target_location AS (
      SELECT
        target_lat AS lat,
        target_lng AS lng
      FROM users
      WHERE id = $1
    ),
    all_candidates AS (
      SELECT
        p.id,
        SUM(CASE
          ${baseFilters}
          WHEN ts.is_positive IS FALSE THEN -3 -- Penalty for dislikes. should restore this to avid breaking query without any filters
          ELSE 0
        END)
        +
        CASE  -- Distance-based score
          WHEN (6371 * ACOS(
            COS(RADIANS((SELECT lat FROM user_target_location))) * COS(RADIANS(p.lat)) *
            COS(RADIANS(p.lng) - RADIANS((SELECT lng FROM user_target_location))) +
            SIN(RADIANS((SELECT lat FROM user_target_location))) * SIN(RADIANS(p.lat))
          )) <= $2 THEN 1
          ELSE -2 -- Penalty for being outside the boundary
        END AS match_count
      FROM properties p
      JOIN l_property_option po ON po.property_id = p.id
      LEFT JOIN tenant_swipes ts ON ts.property_id = p.id
        AND ts.tenant_id = $1
      GROUP BY p.id
    )
    SELECT
      p.*,
      ac.match_count
    FROM properties p
    JOIN all_candidates ac ON ac.id = p.id
    WHERE ac.match_count > 0
    ORDER BY ac.match_count DESC;
  `,
  QUERY_GET_PROPERTY_IMAGES: `
    SELECT
      property_id AS id,
      ARRAY_AGG(image_url) AS images
    FROM property_images
    WHERE property_id = ANY($1)
    GROUP BY property_id
  `,
  QUERY_GET_PROPERTY_OPTIONS: `
    SELECT
      l.property_id AS id,
      o.name,
      l.value
    FROM l_property_option l
    JOIN options o ON o.id = l.option_id
    WHERE l.property_id = ANY($1)
  `,
};
