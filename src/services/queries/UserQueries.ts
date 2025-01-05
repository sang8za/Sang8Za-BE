export default {
  QUERY_GET_USER_BY_ID: `
    SELECT *
    FROM users
    WHERE id = $1`,
  QUERY_GET_USER_LIST: `
    SELECT
      id,
      name,
      type,
      image_url
    FROM users
  `,
};
