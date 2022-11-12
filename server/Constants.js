const format = require('pg-format');

const SELECT_SENSORS_QUERY = `
  SELECT sensor_name, (
    SELECT JSON_AGG(agg) FROM (
      SELECT time, value
      FROM sensors s1
      WHERE s1.sensor_name = s2.sensor_name
      ORDER BY time ASC
    ) AS agg
  ) as data
  FROM sensors s2
  GROUP BY sensor_name
`;

const INSERT_USER_INFO_QUERY = formattedUserInfo => format(
  `
    INSERT INTO accounts (email, name, fumehoods)
    VALUES (%L)
  `,
  formattedUserInfo
);

module.exports = {
  SELECT_SENSORS_QUERY,
  INSERT_USER_INFO_QUERY,
};
