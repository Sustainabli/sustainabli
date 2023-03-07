/** General Constants **/
// Distinct color hexes. If we need more look at https://medialab.github.io/iwanthue/
export const CHART_COLORS = [
  '#6e8fce',
  '#91ba35',
  '#ac60d5',
  '#55c365',
  '#d34699',
  '#468733',
  '#606dd1',
  '#d6a234',
  '#8b509b',
  '#a1b161',
  '#d887c2',
  '#4aa178',
  '#d24458',
  '#42c0c9',
  '#d5572d',
  '#6d7027',
  '#a34a69',
  '#be9453',
  '#e08775',
  '#9f582c',
];

export const SINGLE_CHART_BORDER_COLOR = 'rgb(53, 162, 235)';
export const SINGLE_CHART_BACKGROUND_COLOR = 'rgb(53, 162, 235, 0.5)';

export const TIME_GRANULARITIES = {
  none: 'none',
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'year',
};

export const RELATIVE_TIME_RANGES_OPTIONS = {
  all: {
    value: 'all',
    label: 'All Data',
  },
  one_day: {
    value: '1day',
    label: 'Past Day',
  },
  three_days: {
    value: '3day',
    label: 'Past 3 Days',
  },
  one_week: {
    value: '7day',
    label: 'Past Week',
  },
  one_month: {
    value: '1month',
    label: 'Past Month',
  },
  one_year: {
    value: '1year',
    label: 'Past Year',
  },
};

export const MIN_DATE = new Date('01/01/2000');

export const METRIC_TYPE_AIRFLOW = 'airflow';
export const METRIC_TYPE_CARBON = 'carbon';
export const METRIC_TYPE_ENERGY = 'energy';
export const METRIC_TYPE_COST = 'cost';

export const METRIC_TYPES_MAP = {
  airflow: { type: METRIC_TYPE_AIRFLOW, title: 'Average Airflow', unit: 'CFM' },
  carbon: { type: METRIC_TYPE_CARBON, title: 'Carbon Saved', unit: 'kg' },
  energy: { type: METRIC_TYPE_ENERGY, title: 'Energy Saved', unit: 'kWh' },
  cost: { type: METRIC_TYPE_COST, title: 'Cost Saved', unit: 'dollars' },
};

export const METRIC_TYPES_NEW_METRIC = {
  type: 'newMetric',
  title: 'Add New Metric',
};

export const USER_ROLE = 'user';
export const ORGANIZATION_ADMIN_ROLE = 'organization_admin';
export const SUPER_ADMIN_ROLE = 'super_admin';

// Endpoints for various pages on the website
export const HOME_PAGE_PATH = '/';
export const TEAM_PAGE_PATH = '/team';
export const PROFILE_PAGE_PATH = '/profile';

// API endpoints
export const FETCH_ORGANIZATIONS_PATH = '/api/fetch_organizations';
export const ADD_ORGANIZATION_PATH = '/api/add_organization';
export const DELETE_ORGANIZATION_PATH = '/api/delete_organization';
export const FETCH_GROUPS_IN_ORGANIZATION_PATH = '/api/fetch_groups_in_organization';
export const ADD_GROUP_PATH = '/api/add_group';
export const DELETE_GROUP_PATH = '/api/delete_group';
export const FETCH_ALL_USER_EMAILS_PATH = '/api/fetch_all_user_emails';
export const FETCH_USER_INFO_PATH = '/api/fetch_user_info';
export const FETCH_ALL_ORGANIZATION_ADMIN_USER_INFO_PATH = '/api/fetch_all_organization_admin_user_info';
export const FETCH_ALL_USER_INFO_FROM_ORGANIZATION_PATH = '/api/fetch_all_user_info_from_organization';
export const FETCH_ALL_USER_EMAILS_WITHOUT_ORGANIZATION_PATH = '/api/fetch_all_user_emails_without_organization';
export const ADD_USER_INFO_PATH = '/api/add_user_info';
export const UPDATE_USER_INFO_PATH = '/api/update_user_info';
export const UPDATE_USER_ROLE_PATH = '/api/update_user_role';
export const FETCH_ALL_SENSOR_INFO_PATH = '/api/fetch_all_sensor_info';
export const FETCH_ALL_SENSOR_INFO_FROM_ORGANIZATION_PATH = '/api/fetch_all_sensor_info_from_organization';
export const FETCH_ALL_SENSOR_INFO_FROM_GROUP_PATH = '/api/fetch_all_sensor_info_from_group';
export const ADD_SENSOR_INFO_PATH = '/api/add_sensor_info';
export const UPDATE_SENSOR_INFO_PATH = '/api/update_sensor_info';
export const FETCH_SENSOR_DATA_PATH = '/api/fetch_sensor_data';
export const ADD_SENSOR_DATA_PATH = '/api/add_sensor_data';

// Form Types for Profile Page
export const CREATE_ORGANIZATION = 'create_organization';
export const CREATE_SENSOR = 'create_sensor';
export const ADD_ORGANIZATION_ADMIN = 'add_organization_admin';
export const ADD_USER = 'add_user';
export const CREATE_GROUP = 'create_group';
