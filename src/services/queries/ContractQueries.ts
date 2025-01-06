export default {
  QUERY_CREATE_CONTRACT: `
    INSERT INTO contracts (match_id, tenant_signed, landlord_signed)
    VALUES ($1, TRUE, TRUE)
    RETURNING *
  `,
};
