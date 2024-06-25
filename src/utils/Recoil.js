// Contains all Recoil state objects
// TODO add default values
import { 
  fetchSensorInfoFromGroup, 
  fetchUserInfo, 
  addUserInfo,
  fetchSensorInfoFromOrganization, 
  fetchUsersInOrganization,
  fetchSensorData,
  fetchAllGroupFumeHoodsFromOrganization,
  fetchGroupsInOrganization,
  fetchAllSensorInfo,
  fetchAllOrganizations,
  fetchAllOrganizationAdminUsers,
} from './Requests';
import { 
  ORGANIZATION_ADMIN_ROLE, 
  SUPER_ADMIN_ROLE, 
  USER_ROLE,

  TIME_GRANULARITIES,
  CURRENT_YEAR_DATE,
} from './Constants';

import { fetchUserAttributes } from "aws-amplify/auth";

import {
  atom,
  selector,
  selectorFamily,
} from 'recoil';

export const amplifyEmailState = atom({
  key: "amplifyEmail",
  default: "",
});

export const userInfoSelector = selector({
  key: "userInfo",
  get: async ({ get }) => {
    const amplifyEmail = get(amplifyEmailState);
    const amplifyUser = await fetchUserAttributes();
    if (amplifyEmail) {
      let userInfo = await fetchUserInfo(amplifyEmail);
      // If there is no info on the user, then create an empty user_role account for them for the database
      if (Object.keys(userInfo).length === 0) {
        userInfo = await addUserInfo(amplifyEmail, amplifyUser.name, USER_ROLE, '', '');
      }
      return userInfo;
    }
  }
});

export const userInfosFromOrganizationSelector = selector({
  key: "userInfosFromOrganization",
  get: async ({ get }) => {
    const userInfo = get(userInfoSelector);
    if (userInfo) {
      return await fetchUsersInOrganization(userInfo.organization_code);
    }
  }
});

// Gets available info of available sensors the user has access to
// - For super admins, they will have have access to all sensors registered in the database
// - For organization admins, they will only have access to  all sensors from their organization
// - For regular users, they will only have access to sensors from their group
export const availableSensorInfoSelector = selector({
  key: "availableSensorInfo",
  get: async ({ get }) => { 
    const userInfo = get(userInfoSelector);
    if (userInfo) {
      switch (userInfo.role) {
        case SUPER_ADMIN_ROLE:
          return await fetchAllSensorInfo();
        case ORGANIZATION_ADMIN_ROLE:
          return await fetchSensorInfoFromOrganization(userInfo.organization_code);
        case USER_ROLE:
          return await fetchSensorInfoFromGroup(userInfo.organization_code, userInfo.group_name);
        default:
      }
    }
    return [];
  },
});

export const groupsToFumeHoodsSelector = selector({
  key: "groupsToFumeHoods",
  get: async ({ get }) => {
    const userInfo = get(userInfoSelector);
    if (userInfo) {
      return await fetchAllGroupFumeHoodsFromOrganization(userInfo.organization_code); 
    }
    return [];
  }
});

export const groupsInOrganizationSelector = selector({
  key: "groupsInOrganization",
  get: async ({ get }) => {
    const userInfo = get(userInfoSelector);
    if (userInfo) {
      return await fetchGroupsInOrganization(userInfo.organization_code);
    }
    return [];
  }
});

export const sensorDataFromOrganizationSelector = selector({
  key: "sensorDataFromOrganization",
  get: async ({ get }) => {
    const userInfo = get(userInfoSelector);
    const availableSensorInfo = get(availableSensorInfoSelector);
    if (userInfo && availableSensorInfo) {
      const availableSensorIds = availableSensorInfo.map(sensorInfo => sensorInfo.sensor_id);
      return await fetchSensorData(TIME_GRANULARITIES.day, CURRENT_YEAR_DATE, new Date(), availableSensorIds);
    }
    return [];
  }
});

export const allOrganizationsSelector = selector({
  key: "allOrganizations",
  get: async () => {
      return await fetchAllOrganizations();
  }
});

export const allOrganizationAdminUsersSelector = selector({
  key: "allOrganizationAdminUsers",
  get: async () => {
      return await fetchAllOrganizationAdminUsers();
  }
});

// TODO: figure out why this is causing constant re-rendering when we try to use it
export const sensorDataSelectorFamily = selectorFamily({
  key: "sensorData",
  get: ({ startDate, endDate }) => async ({ get }) => {
    const availableSensorInfo = get(availableSensorInfoSelector);
    const sensorIds = availableSensorInfo.map(sensorInfo => sensorInfo.sensor_id);

    return await fetchSensorData(TIME_GRANULARITIES.day, startDate, endDate, sensorIds);
  },
});
