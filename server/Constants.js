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

const INSERT_SENSOR_DATA_QUERY = formattedSensorsData =>
  format(
    `
      INSERT INTO sensors (time, value, sensor_name)
      VALUES (%L)
    `,
    formattedSensorsData
  );

module.exports = {
  SELECT_SENSORS_QUERY,
  INSERT_SENSOR_DATA_QUERY,
};
