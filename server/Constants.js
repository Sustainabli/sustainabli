const SELECT_ALL_ORGANIZATIONS_QUERY = `
  SELECT *
  FROM organizations
  ORDER BY code;
`;

const INSERT_ORGANIZATION_QUERY = `
  INSERT INTO organizations (code, name)
  VALUES (%L, %L);
`;

const UPDATE_ORGANIZATION_INFO_QUERY = `
  UPDATE organizations
  SET code=%L,
      name=%L
  WHERE code=%L;
`

const DELETE_ORGANIZATION_QUERY = `
  DELETE FROM organizations
  WHERE code=%L;
`;

const SELECT_ALL_GROUPS_FROM_ORGANIZATION_QUERY = `
  SELECT group_name, ARRAY_AGG(JSON_BUILD_OBJECT('id', sensor_id, 'fume_hood_name', fume_hood_name)) AS sensor_infos
  FROM group_fume_hoods
  WHERE organization_code = %L
  GROUP BY group_name
  ORDER BY group_name;
`;

const INSERT_GROUP_QUERY = `
  INSERT INTO groups (organization_code, name)
  VALUES (%L, %L);
`;

const INSERT_GROUP_FUME_HOODS_QUERY = `
  INSERT INTO group_fume_hoods (organization_code, group_name, sensor_id, fume_hood_name)
  VALUES %L;
`;

const UPDATE_GROUP_QUERY = `
  UPDATE groups
  SET name = %L
  WHERE organization_code = %L AND name = %L;
`;

const DELETE_GROUP_QUERY = `
  DELETE FROM groups
  WHERE organization_code=%L AND name=%L;
`;

const DELETE_GROUP_FUME_HOODS_QUERY = `
  DELETE FROM group_fume_hoods
  WHERE organization_code=%L AND group_name=%L;
`;

const SELECT_USER_INFO_QUERY = `
  SELECT email, name, role, organization_code, group_name
  FROM accounts
  WHERE email=%L;
`;

const SELECT_ALL_ORGANIZATION_ADMIN_USER_INFO_QUERY = `
  SELECT email, name, organization_code, group_name
  FROM accounts
  WHERE role='organization_admin';
`;


const SELECT_ALL_USER_INFO_FROM_ORGANIZATION_QUERY = `
  SELECT *
  FROM accounts
  WHERE organization_code = %L AND role != 'organization_admin'
  ORDER BY group_name, email;
`;

const INSERT_USER_INFO_QUERY = `
  INSERT INTO accounts (email, name, role, organization_code, group_name)
  VALUES (%L, %L, %L, %L, %L);
`;

const UPDATE_USER_INFO_QUERY = `
  UPDATE accounts
  SET email = %L,
      role = %L,
      organization_code = %L,
      group_name = %L
  WHERE email=%L;
`;

const UPDATE_USER_ROLE_QUERY = `
  UPDATE accounts
  SET role = %L,
      organization_code = %L
  WHERE email=%L;
`;

const UPDATE_ORGANIZATION_ADMIN_INFO_ON_ORGANIZATION_DELETION_QUERY = `
  UPDATE accounts
  SET role = '',
      organization_code = ''
  WHERE organization_code = %L;
`;

const UPDATE_SENSOR_INFO_ON_ORGANIZATION_DELETION_QUERY = `
  UPDATE sensor_info
  SET organization_code = ''
  WHERE organization_code = %L;
`;

const UPDATE_USER_INFO_ON_GROUP_DELETION_QUERY = `
  UPDATE accounts
  SET group_name = ''
  WHERE organization_code = %L AND group_name = %L;
`;

const SELECT_ALL_SENSOR_INFO_QUERY = `
  SELECT id, organization_code, fume_hood_name
  FROM sensor_info
  ORDER BY organization_code, id;
`;

const SELECT_ALL_SENSOR_INFO_FROM_ORGANIZATION_QUERY = `
  SELECT id, fume_hood_name, organization_code
  FROM sensor_info
  WHERE organization_code = %L
  ORDER BY fume_hood_name;
`;

const SELECT_ALL_SENSOR_INFO_FROM_GROUP_QUERY = `
  SELECT sensor_id, fume_hood_name, organization_code
  FROM group_fume_hoods
  WHERE organization_code = %L AND group_name = %L;
`;


const INSERT_SENSOR_INFO_QUERY = `
  INSERT INTO sensor_info (id, fume_hood_name, organization_code)
  VALUES (%L, %L, %L);
`;

const UPDATE_SENSOR_INFO_QUERY = `
  UPDATE sensor_info
  SET id = %L,
      organization_code = %L
  WHERE id = %L;
`;

const UPDATE_FUME_HOOD_INFO_QUERY = `
  UPDATE sensor_info
  SET fume_hood_name = %L
  WHERE id = %L;
`;

const SELECT_SENSOR_DATA_QUERY = `
  SELECT DATE_TRUNC(%L, time) AS time, fume_hood_name, AVG(value) AS value
  FROM sensor_data INNER JOIN sensor_info ON sensor_data.id = sensor_info.id
  WHERE time >= %L AND time <= %L AND sensor_data.id = ANY(ARRAY[%L]::VARCHAR[])
  GROUP BY DATE_TRUNC(%L, time), fume_hood_name
  ORDER BY time;
`;

const SELECT_ALL_SENSOR_DATA_FOR_ORGANIZATION_QUERY = `
  SELECT 
    sensor_info.fume_hood_name,
    DATE_TRUNC('day', sensor_data.time) AS day,
    sensor_data.id, 
    sensor_data.time, 
    sensor_data.value, 
    sensor_data.status, 
    sensor_data.error_message, 
    sensor_data.lab, 
    sensor_data.account_type, 
    sensor_data.joined, 
    sensor_data.preferred_hood, 
    sensor_data.efficiency_score
  FROM 
    sensor_data 
  INNER JOIN 
    sensor_info ON sensor_data.id = sensor_info.id
  WHERE 
    sensor_info.organization_code = %L
  ORDER BY 
    DATE_TRUNC('day', sensor_data.time), sensor_info.fume_hood_name;
`;

const INSERT_SENSOR_DATA_QUERY = `
  INSERT INTO sensor_data(id, time, value, status, error_message, lab, account_type, joined, preferred_hood, efficiency_score)
  VALUES (%L, %L, %L, %L, %L, %L, %L, %L, %L, %L);
`;

const SELECT_ALL_GROUP_FUME_HOODS_FROM_ORGANIZATION_QUERY = `
  SELECT group_name, ARRAY_AGG(fume_hood_name) as fume_hoods
  FROM group_fume_hoods
  WHERE organization_code = %L
  GROUP BY group_name
  ORDER BY group_name
`;

module.exports = {
  SELECT_ALL_ORGANIZATIONS_QUERY,
  INSERT_ORGANIZATION_QUERY,
  DELETE_ORGANIZATION_QUERY,
  SELECT_ALL_GROUPS_FROM_ORGANIZATION_QUERY,
  INSERT_GROUP_FUME_HOODS_QUERY,
  INSERT_GROUP_QUERY,
  UPDATE_GROUP_QUERY,
  DELETE_GROUP_QUERY,
  SELECT_USER_INFO_QUERY,
  SELECT_ALL_ORGANIZATION_ADMIN_USER_INFO_QUERY,
  SELECT_ALL_USER_INFO_FROM_ORGANIZATION_QUERY,
  INSERT_USER_INFO_QUERY,
  UPDATE_ORGANIZATION_ADMIN_INFO_ON_ORGANIZATION_DELETION_QUERY,
  UPDATE_USER_INFO_QUERY,
  UPDATE_USER_ROLE_QUERY,
  SELECT_ALL_SENSOR_INFO_QUERY,
  SELECT_ALL_SENSOR_INFO_FROM_ORGANIZATION_QUERY,
  SELECT_ALL_SENSOR_INFO_FROM_GROUP_QUERY,
  INSERT_SENSOR_INFO_QUERY,
  UPDATE_SENSOR_INFO_QUERY,
  SELECT_SENSOR_DATA_QUERY,
  INSERT_SENSOR_DATA_QUERY,
  UPDATE_FUME_HOOD_INFO_QUERY,
  UPDATE_ORGANIZATION_INFO_QUERY,
  DELETE_GROUP_FUME_HOODS_QUERY,
  UPDATE_SENSOR_INFO_ON_ORGANIZATION_DELETION_QUERY,
  UPDATE_USER_INFO_ON_GROUP_DELETION_QUERY,
  SELECT_ALL_SENSOR_DATA_FOR_ORGANIZATION_QUERY,
  SELECT_ALL_GROUP_FUME_HOODS_FROM_ORGANIZATION_QUERY,
};
