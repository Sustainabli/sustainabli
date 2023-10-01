import {
  // API paths
  ADD_GROUP_PATH,
  ADD_ORGANIZATION_PATH,
  ADD_SENSOR_INFO_PATH,
  ADD_USER_INFO_PATH,
  DELETE_GROUP_PATH,
  FETCH_ALL_GROUP_FUME_HOODS_FROM_ORGANIZATION,
  FETCH_ALL_ORGANIZATION_ADMIN_USER_INFO_PATH,
  FETCH_ALL_SENSOR_INFO_FROM_GROUP_PATH,
  FETCH_ALL_SENSOR_INFO_FROM_ORGANIZATION_PATH,
  FETCH_ALL_SENSOR_INFO_PATH,
  FETCH_ALL_USER_INFO_FROM_ORGANIZATION_PATH,
  FETCH_GROUPS_IN_ORGANIZATION_PATH,
  FETCH_ORGANIZATIONS_PATH,
  FETCH_ALL_SENSOR_DATA_FOR_ORGANIZATION_PATH,
  FETCH_SENSOR_DATA_PATH,
  FETCH_USER_INFO_PATH,
  UPDATE_FUME_HOOD_INFO_PATH,
  UPDATE_GROUP_INFO_PATH,
  UPDATE_ORGANIZATION_ADMIN_INFO_PATH,
  UPDATE_ORGANIZATION_INFO_PATH,
  DELETE_ORGANIZATION_PATH,
  UPDATE_SENSOR_INFO_PATH,
  UPDATE_USER_INFO_PATH,
  UPDATE_USER_ROLE_PATH,

  // Other imports
  METRIC_TYPE_AIRFLOW,
  METRIC_TYPE_CARBON,
  METRIC_TYPE_COST,
  METRIC_TYPE_ENERGY,
  MIN_DATE,
  RELATIVE_TIME_RANGES_OPTIONS,
  TIME_GRANULARITIES,
} from './Constants.js';

// API calls
export const fetchOrganizations = async () => fetch(FETCH_ORGANIZATIONS_PATH).then(res => res.json());

export const addOrganization = async (organizationCode, organizationName) => {
  const reqBody = {
    organization_code: organizationCode,
    organization_name: organizationName,
  };
  return fetch(ADD_ORGANIZATION_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

export const updateOrganizationInfo = async (newOrganizationCode, newOrganizationName,
    oldOrganizationCode) => {
  const reqBody = {
    old_organization_code: oldOrganizationCode,
    new_organization_code: newOrganizationCode,
    new_organization_name: newOrganizationName,
  };
  return fetch(UPDATE_ORGANIZATION_INFO_PATH, {
    method: 'PUT',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
};

export const deleteOrganization = async (organizationCode) => {
  const reqBody = {
    organization_code: organizationCode
  };
  return fetch(DELETE_ORGANIZATION_PATH, {
    method: 'DELETE',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

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

export const addGroup = async (groupName, organizationCode, sensorInfos) => {
  const reqBody = {
    group_name: groupName,
    organization_code: organizationCode,
    sensor_infos: sensorInfos
  };
  return fetch(ADD_GROUP_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

export const updateGroupInfo = async (newGroupName, oldGroupName, organizationCode, sensorInfos) => {
  const reqBody = {
    new_group_name: newGroupName,
    old_group_name: oldGroupName,
    organization_code: organizationCode,
    sensor_infos: sensorInfos
  };
  return fetch(UPDATE_GROUP_INFO_PATH, {
    method: 'PUT',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

export const deleteGroup = async (groupName, organizationCode) => {
  const reqBody = {
    group_name: groupName,
    organization_code: organizationCode
  };
  return fetch(DELETE_GROUP_PATH, {
    method: 'DELETE',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

export const fetchUserInfo = async (reqBody) => {
  return fetch(FETCH_USER_INFO_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
};

export const fetchOrganizationAdminUserInfo = async () => {
  return fetch(FETCH_ALL_ORGANIZATION_ADMIN_USER_INFO_PATH).then(res => res.json());
};

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
  }).then(res => res.json());
};

export const updateUserInfo = async (newEmail, oldEmail, newGroupName, organizationCode, role,
    queryOrganizationCode) => {
  const reqBody = {
    new_email: newEmail,
    old_email: oldEmail == null ? '' : oldEmail,
    group_name: newGroupName,
    organization_code: organizationCode,
    role: role,
    query_organization_code: queryOrganizationCode,
  };
  return fetch(UPDATE_USER_INFO_PATH, {
    method: 'PUT',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

export const updateOrganizationAdminInfo = async (newEmail, oldEmail, groupName, organizationCode, role) => {
  const reqBody = {
    new_email: newEmail,
    old_email: oldEmail,
    group_name: groupName,
    organization_code: organizationCode,
    role: role
  };
  return fetch(UPDATE_ORGANIZATION_ADMIN_INFO_PATH, {
    method: 'PUT',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

export const updateUserRole = async (email, role, organizationCode) => {
  const reqBody = {
    email: email,
    role: role,
    organization_code: organizationCode,
  };
  return fetch(UPDATE_USER_ROLE_PATH, {
    method: 'PUT',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
};

export const fetchAllSensorInfo = async () => {
  return fetch(FETCH_ALL_SENSOR_INFO_PATH).then(res => res.json());
}

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

export const fetchSensorInfoFromOrganization = async (organizationCode) => {
  const reqBody = {
    organization_code: organizationCode,
  };
  return fetch(FETCH_ALL_SENSOR_INFO_FROM_ORGANIZATION_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
};

export const addSensor = async (sensorId, organizationCode) => {
  const reqBody = {
    sensor_id: sensorId,
    organization_code: organizationCode,
  };
  return fetch(ADD_SENSOR_INFO_PATH, {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

export const updateFumeHoodInfo = async (sensorId, fumeHoodName, organizationCode) => {
  const reqBody = {
    fume_hood_name: fumeHoodName,
    sensor_id: sensorId,
    organization_code: organizationCode
  };
  return fetch(UPDATE_FUME_HOOD_INFO_PATH, {
    method: 'PUT',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

export const updateSensorInfo = async (newId, oldId, organizationCode) => {
  const reqBody = {
    new_id: newId,
    old_id: oldId,
    new_organization_code: organizationCode
  };
  return fetch(UPDATE_SENSOR_INFO_PATH, {
    method: 'PUT',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

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
        if (currTime != datum.time) {
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

export const fetchAllSensorForOrganization = async (organizationCode) => {
  const reqBody = {
    organization_code: organizationCode,
  }

  return fetch(FETCH_ALL_SENSOR_DATA_FOR_ORGANIZATION_PATH, {
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
        if (currTime != datum.time) {
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


export const convertSashHeightToMetricValue = (metricType, value) => {
  switch (metricType) {
    case METRIC_TYPE_ENERGY:
      return ((11 * value) + 136) * 35.71;
    case METRIC_TYPE_CARBON:
      return ((11 * value) + 136) * 13.771064;
    case METRIC_TYPE_COST:
      return ((11 * value) + 136) * 5;
    case METRIC_TYPE_AIRFLOW:
      // return 136 + (11 * value);
      return (11 * value);
    default:
  }
  return value
}

// Formats the date label on the charts based on the granularity we are looking at
//   - NONE:  mm/dd/yyyy hh:mm
//   - DAY:   mm/dd/yyyy
//   - WEEK:  mm/dd/yyyy - mm/dd/yyyy
//   - MONTH: mm/yyyy
//   - YEAR:  yyyy
// Data from backend is stored as UTC. We may need to update this later on
export const formatDateLabel = (date, granularity) => {
  const dateMonth = date.getUTCMonth() + 1;
  const dateDay = date.getUTCDate();
  const dateYear = date.getUTCFullYear();
  let dateHours = date.getUTCHours();
  const ampm = dateHours >= 12 ? 'PM' : 'AM';
  dateHours = dateHours % 12 === 0 ? 12 : dateHours % 12;
  let dateMinutes = date.getUTCMinutes();
  if (dateMinutes < 10) {
    dateMinutes = `0${dateMinutes}`;
  }

  // A week is Monday-Sunday. We manually parse the day range for a week here
  const startWeekOffset = date.getUTCDay() - 1;
  let startWeekDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - startWeekOffset
  );
  const startWeekMonth = startWeekDate.getUTCMonth() + 1;
  const startWeekDay = startWeekDate.getUTCDate();
  const startWeekYear = startWeekDate.getUTCFullYear();
  let endWeekDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    startWeekDate.getDate() + 6
  );
  const endWeekMonth = endWeekDate.getUTCMonth() + 1;
  const endWeekDay = endWeekDate.getUTCDate();
  const endWeekYear = endWeekDate.getUTCFullYear();
  switch (granularity) {
    case TIME_GRANULARITIES.none:
      return `${dateMonth}/${dateDay}/${dateYear}   ${dateHours}:${dateMinutes} ${ampm}`;
    case TIME_GRANULARITIES.day:
      return `${dateMonth}/${dateDay}/${dateYear}`;
    case TIME_GRANULARITIES.week:
      return `${startWeekMonth}/${startWeekDay}/${startWeekYear} - ${endWeekMonth}/${endWeekDay}/${endWeekYear}`;
    case TIME_GRANULARITIES.month:
      return `${dateMonth}/${dateYear}`;
    case TIME_GRANULARITIES.year:
      return `${dateYear}`;
    default:
  }
};

// Generate default chart options
// Accepts the chart ttile, y axis label, and x axis label
export const generateChartOptions = (title, yLabel, xLabel, tooltipLabels=null) => {
  return {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: title,
        color: '#000000',
        font: {
          size: 30,
        },
      },
      ...tooltipLabels && {
        tooltip: {
          callbacks: {
            label: tooltipLabels,
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: 'true',
          text: xLabel,
        },
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        title: {
          display: 'true',
          text: yLabel,
        },
      },
    },
  };
};

export const getOffsettedStartDate = (date, offset) => {
  switch (offset) {
    case RELATIVE_TIME_RANGES_OPTIONS.all.value:
      return MIN_DATE;
    case RELATIVE_TIME_RANGES_OPTIONS.one_day.value:
      date.setDate(date.getDate() - 1);
      break;
    case RELATIVE_TIME_RANGES_OPTIONS.three_days.value:
      date.setDate(date.getDate() - 3);
      break;
    case RELATIVE_TIME_RANGES_OPTIONS.one_week.value:
      date.setDate(date.getDate() - 7);
      break;
    case RELATIVE_TIME_RANGES_OPTIONS.one_month.value:
      date.setMonth(date.getMonth() - 1);
      break;
    case RELATIVE_TIME_RANGES_OPTIONS.one_year.value:
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
  }
  return date;
};
