const express = require('express');
const path = require('path');
const format = require('pg-format');
const { pool } = require('./sensors-db');

const {
  DELETE_GROUP_FUME_HOODS_QUERY,
  DELETE_GROUP_QUERY,
  DELETE_ORGANIZATION_QUERY,
  INSERT_GROUP_FUME_HOODS_QUERY,
  INSERT_GROUP_QUERY,
  INSERT_ORGANIZATION_QUERY,
  INSERT_SENSOR_DATA_QUERY,
  INSERT_SENSOR_INFO_QUERY,
  INSERT_USER_INFO_QUERY,
  SELECT_ALL_GROUPS_FROM_ORGANIZATION_QUERY,
  SELECT_ALL_GROUP_FUME_HOODS_FROM_ORGANIZATION_QUERY,
  SELECT_ALL_ORGANIZATION_ADMIN_USER_INFO_QUERY,
  SELECT_ALL_ORGANIZATIONS_QUERY,
  SELECT_ALL_SENSOR_INFO_FROM_GROUP_QUERY,
  SELECT_ALL_GROUPS_FROM_SENSOR_INFO,
  SELECT_ALL_SENSOR_INFO_FROM_ORGANIZATION_QUERY,
  SELECT_ALL_SENSOR_INFO_QUERY,
  SELECT_ALL_USER_INFO_FROM_ORGANIZATION_QUERY,
  SELECT_ALL_SENSOR_DATA_FOR_ORGANIZATION_QUERY,
  SELECT_SENSOR_DATA_QUERY,
  SELECT_USER_INFO_QUERY,
  UPDATE_FUME_HOOD_INFO_QUERY,
  UPDATE_GROUP_QUERY,
  UPDATE_ORGANIZATION_ADMIN_INFO_ON_ORGANIZATION_DELETION_QUERY,
  UPDATE_ORGANIZATION_INFO_QUERY,
  UPDATE_SENSOR_INFO_ON_ORGANIZATION_DELETION_QUERY,
  UPDATE_SENSOR_INFO_QUERY,
  UPDATE_USER_INFO_ON_GROUP_DELETION_QUERY,
  UPDATE_USER_INFO_QUERY,
  UPDATE_USER_ROLE_QUERY,
  DELETE_GROUP_ON_FUME_HOOD_UPDATE,
} = require('./Constants');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.static(path.resolve(__dirname, '../build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, _ => console.log(`Listening on port ${port}`));

// Fetches all organizations in database
// response: {
//   List of organizations
// }
app.get('/api/fetch_organizations', async (_, res) => {
  pool.query(SELECT_ALL_ORGANIZATIONS_QUERY, (err, results) => {
    if (err) {
      res.status(500).send('POST fetch organizations errored ' + err);
      return;
    }
    const toRet = results.rows;
    res.status(200).json(toRet);
  });
});

// Adds organization to database
// reqBody: {
//  organization_code: String,
//  organization_name: String,
// }
// response: {
//   List of organizations
// }
app.post('/api/add_organization', async (req, res) => {
  const { organization_code, organization_name } = req.body;
  const client = await pool.connect();
  let toRet;
  try {
    await client.query('BEGIN');
    await client.query(format(INSERT_ORGANIZATION_QUERY, organization_code, organization_name));
    toRet = (await client.query(SELECT_ALL_ORGANIZATIONS_QUERY)).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('POST add organization errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});

// TODO add javadoc
app.put('/api/update_organization_info', async(req, res) => {
  const { new_organization_code, new_organization_name, old_organization_code } = req.body;
  const client = await pool.connect();
  let toRet;
  try {
    await client.query('BEGIN');
    await client.query(format(UPDATE_ORGANIZATION_INFO_QUERY, new_organization_code, new_organization_name, old_organization_code));
    toRet = (await client.query(SELECT_ALL_ORGANIZATIONS_QUERY)).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('DELETE delete organization errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});

// Deletes organization from database
// reqBody: {
//  organization_code: String,
// }
// response: {
//   List of organizations
// }
app.delete('/api/delete_organization', async (req, res) => {
  const { organization_code } = req.body;
  const client = await pool.connect();
  let toRet = {};
  try {
    await client.query('BEGIN');
    await client.query(format(DELETE_ORGANIZATION_QUERY, organization_code));
    toRet.organizations = (await client.query(SELECT_ALL_ORGANIZATIONS_QUERY)).rows;
    await client.query(format(UPDATE_SENSOR_INFO_ON_ORGANIZATION_DELETION_QUERY, organization_code));
    toRet.sensors = (await client.query(SELECT_ALL_SENSOR_INFO_QUERY)).rows;
    await client.query(format(UPDATE_ORGANIZATION_ADMIN_INFO_ON_ORGANIZATION_DELETION_QUERY,
        organization_code));
    toRet.organization_admins = (await client.query(SELECT_ALL_ORGANIZATION_ADMIN_USER_INFO_QUERY)).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('DELETE delete organization errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});

// Fetches all groups from a particular organization
// reqBody: {
//  organization_code: String,
// }
// response: {
//   List of groups from organization
// }
app.post('/api/fetch_groups_in_organization', async (req, res) => {
  const { organization_code } = req.body;
  pool.query(format(SELECT_ALL_GROUPS_FROM_ORGANIZATION_QUERY, organization_code), (err, results) => {
    if (err) {
      res.status(500).send('POST fetch groups errored ' + err);
      return;
    }
    const toRet = results.rows;
    res.status(200).json(toRet);
  });
});

// Adds group to database
// reqBody: {
//  organization_code: String,
//  group_name: String,
//  sensor_infos: List of sensor ids
// }
// response: {
//   List of groups from organization
// }
app.post('/api/add_group', async (req, res) => {
  const { organization_code, group_name, sensor_infos } = req.body;
  const client = await pool.connect();
  let toRet;
  try {
    await client.query('BEGIN');
    await client.query(format(INSERT_GROUP_QUERY, organization_code, group_name));
    const formattedSensors = sensor_infos.map(sensor => [organization_code, group_name, sensor.id, sensor.fume_hood_name]);
    await client.query(format(INSERT_GROUP_FUME_HOODS_QUERY, formattedSensors));
    toRet = (await client.query(format(SELECT_ALL_GROUPS_FROM_ORGANIZATION_QUERY, organization_code))).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('POST add group errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});

app.put('/api/update_group_info', async (req, res) => {
  const { organization_code, old_group_name, new_group_name, sensor_infos } = req.body;
  const client = await pool.connect();
  let toRet;
  try {
    await client.query('BEGIN');
    await client.query(format(UPDATE_GROUP_QUERY, new_group_name, organization_code, old_group_name));
    await client.query(format(DELETE_GROUP_FUME_HOODS_QUERY, organization_code, new_group_name));
    const formattedSensors = sensor_infos.map(sensor => [organization_code, new_group_name, sensor.id, sensor.fume_hood_name]);
    await client.query(format(INSERT_GROUP_FUME_HOODS_QUERY, formattedSensors));
    toRet = (await client.query(format(SELECT_ALL_GROUPS_FROM_ORGANIZATION_QUERY, organization_code))).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('PUT update group info errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});

// Deletes group from database
// reqBody: {
//  organization_code: String,
//  group_name: String,
// }
// response: {
//  List of groups from the organization
// }
app.delete('/api/delete_group', async (req, res) => {
  const { organization_code, group_name } = req.body;
  const client = await pool.connect();
  let toRet = {};
  try {
    await client.query('BEGIN');
    await client.query(format(DELETE_GROUP_QUERY, organization_code, group_name));
    await client.query(format(DELETE_GROUP_FUME_HOODS_QUERY, organization_code, group_name));
    toRet.groups = (await client.query(format(SELECT_ALL_GROUPS_FROM_ORGANIZATION_QUERY, organization_code))).rows;
    await client.query(format(UPDATE_USER_INFO_ON_GROUP_DELETION_QUERY, organization_code, group_name));
    toRet.users = (await client.query(format(SELECT_ALL_USER_INFO_FROM_ORGANIZATION_QUERY,
        organization_code))).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('DELETE delete organization errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});

// Fetch user info from database
// reqBody: {
//  email: String,
// }
// response: {
//  email: String,
//  name: String,
//  role: String,
//  organization: String,
//  group: String,
// }
app.post('/api/fetch_user_info', async (req, res) => {
  const { email } = req.body;
  pool.query(format(SELECT_USER_INFO_QUERY, email), (err, results) => {
    if (err) {
      res.status(500).send('POST fetch user info errored ' + err);
      return;
    }
    const toRet = results.rows[0] ? results.rows[0] : {};
    res.status(200).json(toRet);
  });
});

// Fetch all organization admin user info
// response: {
//  List of account info
// }
app.get('/api/fetch_all_organization_admin_user_info', async (_, res) => {
  pool.query(SELECT_ALL_ORGANIZATION_ADMIN_USER_INFO_QUERY, (err, results) => {
    if (err) {
      res.status(500).send('GET fetch all organization admin user info ' + err);
      return;
    }
    const toRet = results.rows;
    res.status(200).json(toRet);
  })
});

// Fetch all user info from organization
// reqBody: {
//  organization_code: String,
// }
// response: {
//  List of account info
// }
app.post('/api/fetch_all_user_info_from_organization', async (req, res) => {
  const { organization_code } = req.body;
  pool.query(format(SELECT_ALL_USER_INFO_FROM_ORGANIZATION_QUERY, organization_code), (err, results) => {
    if (err) {
      res.status(500).send('POST fetch all user info from organization errored ' + err);
      return;
    }
    const toRet = results.rows;
    res.status(200).json(toRet);
  });
});

// Adds user info to database
// reqBody: {
//  email: String,
//  name: String,
//  role: String,
//  organization_code: String,
//  group_name: String,
// }
// response: {
//  List of users from organization
// }
app.post('/api/add_user_info', async (req, res) => {
  const { email, name, role, organization_code, group_name } = req.body;
  const client = await pool.connect();
  let toRet;
  try {
    await client.query('BEGIN');
    await client.query(format(INSERT_USER_INFO_QUERY, email, name, role, organization_code, group_name));
    toRet = (await client.query(format(SELECT_USER_INFO_QUERY, organization_code))).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('POST add user info errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});


// Updates user info in database
// reqBody: {
//  query_organization_code: String,
//  user_info: {
//   email: String,
//   name: String,
//   role: String,
//   organization_code: String,
//   group_name: String,
//  }
// }
// response: {
//  List of user info
// }
app.put('/api/update_user_info', async (req, res) => {
  const { new_email, old_email, group_name, organization_code, role, query_organization_code } = req.body;
  const client = await pool.connect();
  let toRet;
  try {
    await client.query('BEGIN');
    await client.query(format(UPDATE_USER_INFO_QUERY, new_email, role, organization_code, group_name, old_email));
    toRet = (await client.query(format(SELECT_ALL_USER_INFO_FROM_ORGANIZATION_QUERY, query_organization_code))).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('PUT update user info errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});

app.put('/api/update_organization_admin_info', async (req, res) => {
  const { old_email, new_email, group_name, organization_code, role } = req.body;
  const client = await pool.connect();
  let toRet;
  try {
    await client.query('BEGIN');
    await client.query(format(UPDATE_USER_INFO_QUERY, new_email, role, organization_code, group_name, old_email));
    toRet = (await client.query(SELECT_ALL_ORGANIZATION_ADMIN_USER_INFO_QUERY)).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('PUT update user info errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});

// Updates user role
// reqBody: {
//  email: String,
//  role: String,
// }
// response: {
//  email: String,
//  name: String,
//  role: String,
//  organizationCode: String,
//  groupName: String
// }
app.put('/api/update_user_role', async (req, res) => {
  const { email, role, organization_code } = req.body;
  const client = await pool.connect();
  let toRet;
  try {
    await client.query('BEGIN');
    await client.query(format(UPDATE_USER_ROLE_QUERY, role, organization_code, email));
    toRet = (await client.query(SELECT_ALL_ORGANIZATION_ADMIN_USER_INFO_QUERY)).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('PUT update user info errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});

// Fetch all sensor info in database
// response: {
//  List of sensor info
// }
app.get('/api/fetch_all_sensor_info', async (_, res) => {
  pool.query(SELECT_ALL_SENSOR_INFO_QUERY, (err, results) => {
    if (err) {
      res.status(500).send('GET fetch all user info errored ' + err);
      return;
    }
    const toRet = results.rows;
    res.status(200).json(toRet);
  });
});

// Fetch all sensor info from organization
// reqBody: {
//  organization_code: String,
// }
// response: {
//  List of sensor info
// }
app.post('/api/fetch_all_sensor_info_from_organization', async (req, res) => {
  const { organization_code } = req.body;
  pool.query(format(SELECT_ALL_SENSOR_INFO_FROM_ORGANIZATION_QUERY, organization_code), (err, results) => {
    if (err) {
      res.status(500).send('POST fetch all sensor info from organization errored ' + err);
      return;
    }
    const toRet = results.rows;
    res.status(200).json(toRet);
  });
});

// Fetch all sensor info from group
// reqBody: {
//  group_name: String,
// }
// response: {
//  List of sensors info
// }
app.post('/api/fetch_all_sensor_info_from_group', async (req, res) => {
  const { organization_code, group_name } = req.body;
  pool.query(format(SELECT_ALL_SENSOR_INFO_FROM_GROUP_QUERY, organization_code, group_name), (err, results) => {
    if (err) {
      res.status(500).send('POST fetch all sensor info from group errored ' + err);
      return;
    }
    const toRet = results.rows;
    res.status(200).json(toRet);
  });
});

// adds sensor info to database
// reqbody: {
//  sensor_id: string,
//  organization_code: string,
// }
// response: {
//  list of all sensor info in database
// }
app.post('/api/add_sensor_info', async (req, res) => {
  const { sensor_id, organization_code } = req.body;
  const client = await pool.connect();
  let toRet;
  try {
    await client.query('BEGIN');
    await client.query(format(INSERT_SENSOR_INFO_QUERY, sensor_id, sensor_id, organization_code));
    toRet = (await client.query(SELECT_ALL_SENSOR_INFO_QUERY)).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('POST add sensor info info errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});

// Update existing sensor info in database
// reqBody {
//  sensor_id: String,
//  fume_hood_name: String,
//  building: String,
//  room: String,
//  lab: String,
//  organization_code: String
// }
// response {
//  List of sensor info from organization
// }
app.put('/api/update_fume_hood_info', async (req, res) => {
  const { sensor_id, fume_hood_name, building, room, lab, organization_code } = req.body;
  const client = await pool.connect();
  let toRet = {};
  try {
    await client.query('BEGIN');
    await client.query(format(UPDATE_FUME_HOOD_INFO_QUERY, fume_hood_name, building, room, sensor_id));
    const existing_groups = ((await client.query(format(SELECT_ALL_GROUPS_FROM_SENSOR_INFO, organization_code, sensor_id))).rows).map((ele) => ele.group_name);
    const needsDelete = existing_groups.filter((ele) => !lab.includes(ele))
    if (needsDelete.length > 0) {
      //array of size 1 gets translated to 'Group_x' instead of '(Group_x)'
      needsDelete.length === 1
        ? await client.query(
            format(DELETE_GROUP_ON_FUME_HOOD_UPDATE, sensor_id, [needsDelete])
          )
        : await client.query(
            format(DELETE_GROUP_ON_FUME_HOOD_UPDATE, sensor_id, needsDelete)
          );
    }
    const needsAdd = lab.filter((ele) => !existing_groups.includes(ele)).map((group) => [organization_code, group, sensor_id, fume_hood_name])
    if (needsAdd.length >= 1) {
        await client.query(format(INSERT_GROUP_FUME_HOODS_QUERY, needsAdd));
    }
    toRet.fume_hoods = (await client.query(format(SELECT_ALL_SENSOR_INFO_FROM_ORGANIZATION_QUERY, organization_code))).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('PUT update sensor info info errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});

app.put('/api/update_sensor_info', async (req, res) => {
  const { old_id, new_id, new_organization_code } = req.body;
  const client = await pool.connect();
  let toRet;
  try {
    await client.query('BEGIN');
    await client.query(format(UPDATE_SENSOR_INFO_QUERY, new_id, new_organization_code, old_id));
    toRet = (await client.query(SELECT_ALL_SENSOR_INFO_QUERY)).rows;
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).send('PUT update sensor info info errored ' + err);
    return;
  } finally {
    client.release();
  }
  res.status(200).json(toRet);
});

// Fetch sensor data from database
// reqBody: {
//  granularity: String,
//  start_date: Date,
//  end_date: Date,
//  sensors: List of Strings,
// }
// response: {
//  List of {time: Date, data: Object of sensor data}
// }
app.post('/api/fetch_sensor_data', (req, res) => {
  const { granularity, start_date, end_date, sensors } = req.body;
  pool.query(format(SELECT_SENSOR_DATA_QUERY, granularity, start_date, end_date, sensors, granularity), (err, results) => {
    if (err) {
      res.status(500).send('POST fetch sensors data errored ' + err);
      console.log(err);
      return;
    }
    const toRet = results.rows;
    res.status(200).json(toRet);
  });
});

app.post('/api/fetch_all_sensor_data_for_organization', (req, res) => {
  const { organization_code} = req.body;
  pool.query(format(SELECT_ALL_SENSOR_DATA_FOR_ORGANIZATION_QUERY, organization_code), (err, results) => {
    if (err) {
      res.status(500).send('POST fetch sensors data errored ' + err);
      return;
    }
    const toRet = results.rows;
    res.status(200).json(toRet);
  });
});

app.post('/api/fetch_all_group_fume_hoods_from_organization', (req, res) => {
  const { organization_code} = req.body;
  pool.query(format(SELECT_ALL_GROUP_FUME_HOODS_FROM_ORGANIZATION_QUERY, organization_code), (err, results) => {
    if (err) {
      res.status(500).send('POST fetch sensors data errored ' + err);
      return;
    }
    const toRet = results.rows;
    res.status(200).json(toRet);
  });
});



// adds sensor data to database
// reqBody: {
//  sensor_id: String,
//  time: Date,
//  value: Number,
//  sensor_status: String,
//  error_message: String
// }
// response: { }
app.post('/api/add_sensor_data', async (req, res) => {
  const { sensor_id, time, value, sensor_status, error_message } = req.body;
  pool.query(format(INSERT_SENSOR_DATA_QUERY, sensor_id, time, value, sensor_status, error_message), (err, _) => {
  if (err) {
    res.status(500).send('POST add sensor data errored ' + err);
    return;
  }
  res.status(200).json('POST add sensor data succeeded');
  });
});

app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});
