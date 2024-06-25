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

export const SNAPSHOT_COLORS = [
  'rgb(135, 211, 0)',
  'rgb(246,230,0)',
  'rgb(239,165,0)',
  'rgb(199,0,5)',
  'rgb(140,26,255)',
]

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

// TODO: find a better date to use for MIN_DATE when viewing all data
export const MIN_DATE = new Date(2023, 0, 1);
const currentDate = new Date();
export const CURRENT_YEAR_DATE = new Date(currentDate.getFullYear(), 0, 1);

export const MILLISECONDS_IN_DAY = 86400000;
export const DAYS_IN_YEARS = 365

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

// User roles
export const SUPER_ADMIN_ROLE = 'super_admin';
export const ORGANIZATION_ADMIN_ROLE = 'organization_admin';
export const USER_ROLE = 'user';

// Endpoints for various pages on the website
export const OVERVIEW_PAGE_PATH = '/';
export const PROFILE_PAGE_PATH = '/profile';
export const ORGANIZATION_PAGE_PATH = '/organization';
export const LOGIN_PAGE_PATH = '/login';
export const FUME_HOODS_PAGE_PATH = '/fume_hoods';
export const DATA_QUERY_PAGE_PATH = '/data_query';
export const SHUT_THE_SASH_PAGE_PATH = '/shut_the_sash';

// Form Types
export const ADD_ORGANIZATION_ADMIN = 'add_organization_admin';
export const ADD_USER = 'add_user';
export const CREATE_GROUP = 'create_group';
export const CREATE_ORGANIZATION = 'create_organization';
export const CREATE_SENSOR = 'create_sensor';
export const UPDATE_FUME_HOOD_INFO = 'update_fume_hood_info';
export const UPDATE_GROUP_INFO = 'update_group_info';
export const UPDATE_ORGANIZATION_ADMIN_INFO = 'update_organization_admin_info';
export const UPDATE_ORGANIZATION_INFO = 'update_organization_info';
export const UPDATE_SENSOR_INFO = 'update_sensor_info';
export const UPDATE_USER_INFO = 'update_user_info';
export const UPDATE_USER_GROUP = 'update_user_group';
export const ADD_USER_TO_ORGANIZATION = "add_user_to_organization";

// Partition labels used in FivePointSnapshot
export const PARTITION_LABELS = [
  "Closed",
  "0-10cm",
  "10-25cm",
  "25-45cm",
  "> 45cm",
];
