const SELECT_ALL_ORGANIZATIONS_QUERY = `
  SELECT *
  FROM organizations
  ORDER BY code;
`;

const INSERT_ORGANIZATION_QUERY = `
  INSERT INTO organizations (code, name)
  VALUES (%L, %L);
`;

const DELETE_ORGANIZATION_QUERY = `
  DELETE FROM organizations
  WHERE code=%L;
`;

// TODO inner join this on sensor_info to get fume_hood_name
const SELECT_ALL_GROUPS_FROM_ORGANIZATION_QUERY = `
  SELECT name, sensors
  FROM groups
  WHERE organization_code = %L
  ORDER BY name;
`;

const INSERT_GROUP_QUERY = `
  INSERT INTO groups (organization_code, name, sensors)
  VALUES (%L, %L, ARRAY[%L]::VARCHAR[]);
`;

const DELETE_GROUP_QUERY = `
  DELETE FROM groups
  WHERE organization_code=%L AND name=%L;
`;

const SELECT_ALL_USER_EMAILS = `
  SELECT email
  FROM accounts
  WHERE role != 'super_admin'
`;

const SELECT_USER_INFO_QUERY = `
  SELECT email, name, role, organization_code AS "organizationCode", group_name AS "groupName"
  FROM accounts
  WHERE email=%L;
`;

const SELECT_ALL_ORGANIZATION_ADMIN_USER_INFO_QUERY = `
  SELECT email, name, organization_code AS "organizationCode", group_name AS "groupName"
  FROM accounts
  WHERE role='organization_admin';
`;

const SELECT_ALL_USER_INFO_FROM_ORGANIZATION_QUERY = `
  SELECT *
  FROM accounts
  WHERE organization_code = %L AND role != 'organization_admin'
  ORDER BY group_name, email;
`;

const SELECT_ALL_USER_EMAILS_WITHOUT_ORGANIZATION_QUERY = `
  SELECT email
  FROM accounts
  WHERE organization_code='' AND role='user';
`;

const INSERT_USER_INFO_QUERY = `
  INSERT INTO accounts (email, name, role, organization_code, group_name)
  VALUES (%L, %L, %L, %L, %L);
`;

const UPDATE_USER_INFO_QUERY = `
  UPDATE accounts
  SET role = %L,
      organization_code = %L,
      group_name = %L
  WHERE email=%L;
`;

const UPDATE_USER_ROLE_QUERY = `
  UPDATE accounts
  SET role = %L,
      organization_code = %L
  WHERE email=%L
`;

const SELECT_ALL_SENSOR_INFO = `
  SELECT id, organization_code AS "organizationCode"
  FROM sensor_info
  ORDER BY organization_code;
`;

const SELECT_ALL_SENSOR_INFO_FROM_ORGANIZATION_QUERY = `
  SELECT id, fume_hood_name AS "fumeHoodName", organization_code AS "organizationCode"
  FROM sensor_info
  WHERE organization_code = %L
  ORDER BY fume_hood_name;
`;

const SELECT_ALL_SENSOR_INFO_FROM_GROUP = `
  SELECT id, fume_hood_name AS "fumeHoodName", organization_code AS "organizationCode"
  FROM (
    SELECT name, unnest(sensors) AS sensor
    FROM groups
  ) AS groups
  JOIN sensor_info ON sensor = id
  WHERE groups.name = %L;
`;

const INSERT_SENSOR_INFO_QUERY = `
  INSERT INTO sensor_info (id, fume_hood_name, organization_code)
  VALUES (%L, %L, %L);
`;

const UPDATE_SENSOR_INFO_QUERY = `
  UPDATE sensor_info
  SET fume_hood_name = %L
  WHERE id = %L;
`;

const SELECT_SENSOR_DATA_QUERY = `
  SELECT DATE_TRUNC(%L, time) AS time, (
    SELECT JSON_OBJECT_AGG(key, value) FROM (
      SELECT fume_hood_name, AVG(value)
      FROM sensor_data inner_table
      WHERE inner_table.time = outer_table.time
    ) AS obj(key, value)
  ) AS data
  FROM sensor_data outer_table INNER JOIN sensor_info ON outer_table.id=sensor_info.id
  WHERE time >= %L AND time <= %L AND outer_table.id = ANY (ARRAY[%L]::VARCHAR[])
  GROUP BY time, fume_hood_name
  ORDER BY time;
`;

const INSERT_SENSOR_DATA_QUERY = `
  INSERT INTO sensor_data(id, time, value, status, error_message)
  VALUES (%L, %L, %L, %L, %L);
`;

module.exports = {
  SELECT_ALL_ORGANIZATIONS_QUERY,
  INSERT_ORGANIZATION_QUERY,
  DELETE_ORGANIZATION_QUERY,
  SELECT_ALL_GROUPS_FROM_ORGANIZATION_QUERY,
  INSERT_GROUP_QUERY,
  DELETE_GROUP_QUERY,
  SELECT_ALL_USER_EMAILS,
  SELECT_USER_INFO_QUERY,
  SELECT_ALL_ORGANIZATION_ADMIN_USER_INFO_QUERY,
  SELECT_ALL_USER_INFO_FROM_ORGANIZATION_QUERY,
  SELECT_ALL_USER_EMAILS_WITHOUT_ORGANIZATION_QUERY,
  INSERT_USER_INFO_QUERY,
  UPDATE_USER_INFO_QUERY,
  UPDATE_USER_ROLE_QUERY,
  SELECT_ALL_SENSOR_INFO,
  SELECT_ALL_SENSOR_INFO_FROM_ORGANIZATION_QUERY,
  SELECT_ALL_SENSOR_INFO_FROM_GROUP,
  INSERT_SENSOR_INFO_QUERY,
  UPDATE_SENSOR_INFO_QUERY,
  SELECT_SENSOR_DATA_QUERY,
  INSERT_SENSOR_DATA_QUERY,
};
