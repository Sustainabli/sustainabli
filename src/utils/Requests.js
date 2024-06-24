// Contains functions for REST API calls

const FETCH_USER_INFO_PATH = '/api/fetch_user_info';
export const fetchUserInfo = async (email) => {
  const reqBody = {
    email: email,
  };
  return fetch(FETCH_USER_INFO_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => {
      return res.json();
    });
};

const ADD_USER_INFO_PATH = '/api/add_user_info';
export const addUserInfo = async (email, name, role, organizationCode, groupName) => {
  const reqBody = {
    email: email,
    name: name,
    role: role,
    organization_code: organizationCode,
    group_name: groupName
  };
  return fetch(ADD_USER_INFO_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => {
      return res.json();
    });
};

const FETCH_ALL_USER_INFO_FROM_ORGANIZATION_PATH = '/api/fetch_all_user_info_from_organization';
export const fetchUsersInOrganization = async (organizationCode) => {
  const reqBody = {
    organization_code: organizationCode
  };
  return fetch(FETCH_ALL_USER_INFO_FROM_ORGANIZATION_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
};

const FETCH_ALL_SENSOR_INFO_FROM_GROUP_PATH = '/api/fetch_all_sensor_info_from_group';
export const fetchSensorInfoFromGroup = async (organizationCode, groupName) => {
  const reqBody = {
    organization_code: organizationCode,
    group_name: groupName,
  };
  return fetch(FETCH_ALL_SENSOR_INFO_FROM_GROUP_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json())
};

const FETCH_ALL_SENSOR_INFO_FROM_ORGANIZATION_PATH = '/api/fetch_all_sensor_info_from_organization';
export const fetchSensorInfoFromOrganization = async (organizationCode) => {
  const reqBody = {
    organization_code: organizationCode,
  };
  return fetch(FETCH_ALL_SENSOR_INFO_FROM_ORGANIZATION_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json())
    .catch(err => console.warn(err));
};

export const UPDATE_FUME_HOOD_INFO_PATH = '/api/update_fume_hood_info';
export const updateFumeHoodInfo = async (sensorId, fumeHoodName, building, room, lab, organizationCode) => {
  const reqBody = {
    fume_hood_name: fumeHoodName,
    sensor_id: sensorId,
    building: building,
    room: room,
    lab: lab,
    organization_code: organizationCode
  };
  return fetch(UPDATE_FUME_HOOD_INFO_PATH, {
    method: 'PUT',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}


const FETCH_SENSOR_DATA_PATH = '/api/fetch_sensor_data';
export const fetchSensorData = async (granularity, startDate, endDate, sensors) => {
  const reqBody = {
    granularity: granularity,
    start_date: startDate,
    end_date: endDate,
    sensors: sensors
  }
  return fetch(FETCH_SENSOR_DATA_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json())
    .then(res => {
      // We are guaranteed that the result is sorted by date
      const toRet = [];
      let currTime = null;
      // Index of toRet
      let currIndex = -1;
      res.forEach(datum => {
        // New timestamp so create a new data object
        if (currTime !== datum.time) {
          currTime = datum.time;
          const currDatum = {
            time: datum.time,
            data: {}
          };
          toRet.push(currDatum);
          currIndex++;
        }
        toRet[currIndex].data[datum.fume_hood_name] = datum.value;
      });
      return toRet;
    });
};

const FETCH_ALL_GROUP_FUME_HOODS_FROM_ORGANIZATION = '/api/fetch_all_group_fume_hoods_from_organization';
export const fetchAllGroupFumeHoodsFromOrganization = async (organizationCode) => {
  const reqBody = {
    organization_code: organizationCode
  };
  return fetch(FETCH_ALL_GROUP_FUME_HOODS_FROM_ORGANIZATION, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

export const ADD_USER_TO_ORGANIZATION_PATH = '/api/add_user_to_organization';
export const addUserToOrganization = async (email, organizationCode, groupName) => {
  const reqBody = {
    email: email,
    organization_code: organizationCode,
    group_name: groupName
  };
  return fetch(ADD_USER_TO_ORGANIZATION_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
};

const FETCH_GROUPS_IN_ORGANIZATION_PATH = '/api/fetch_groups_in_organization';
export const fetchGroupsInOrganization = async (organizationCode) => {
  const reqBody = {
    organization_code: organizationCode
  };
  return fetch(FETCH_GROUPS_IN_ORGANIZATION_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
};
