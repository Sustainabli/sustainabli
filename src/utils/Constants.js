import { capitalizeString } from './Utils';

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

export const FETCH_DATA_URL = '/api/data';

export const FETCH_SENSORS_DATA_URL = '/api/sensors';

export const LOADING_COLOR = '#171b26';

/** Data and Chart Constants **/
export const COMPETITION_START_DATE = new Date('04/01/022');

export const DATA_TYPES = {
  sash: 'sash',
  cfm: 'cfm',
};

// Single lab and all labs data have different formats
export const DATA_FORMATS = {
  singleLab: 'single_lab',
  allLabs: 'all_labs',
};

// Different graph types have different output formats
export const GRAPH_TYPES = {
  line: 'line',
  bar: 'bar',
};

export const LAB_FUMEHOOD_MAPPING = {
  issacs: [
    // Removing for competition purposes
    // 'FMGTAP012L01_B091_ChemistryW3_Room3336_FumeHood1_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room3336_FumeHood2_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room3336_FumeHood3_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room3336_FumeHood4_ExhaustCFM_Tridium',
  ],
  falvey: [
    'FMGTAP012L01_B091_ChemistryW3_Room3356_FumeHood1_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room3356_FumeHood2_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room3356_FumeHood3_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room3356_FumeHood4_ExhaustCFM_Tridium',
  ],
  rodriguez: [
    'FMGTAP012L01_B091_ChemistryW3_Room2360_FumeHood3_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room2360_FumeHood4_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room2364_FumeHood1_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room2364_FumeHood2_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room2364_FumeHood3_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room2364_FumeHood4_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room2368_FumeHood1_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room2368_FumeHood2_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room2368_FumeHood3_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room2368_FumeHood4_ExhaustCFM_Tridium',
  ],
  wang: [
    'FMGTAP012L01_B091_ChemistryW3_Room1302_FumeHood4_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1302_FumeHood5_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1302_FumeHood6_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1302_FumeHood7_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1302_FumeHood8_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1302_FumeHood9_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1302_FumeHood10_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1308_FumeHood1_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1308_FumeHood3_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1308_FumeHood4_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1308_FumeHood5_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1308_FumeHood6_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1308_FumeHood7_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1308_FumeHood8_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1308_FumeHood9_ExhaustCFM_Tridium',
    'FMGTAP012L01_B091_ChemistryW3_Room1308_FumeHood10_ExhaustCFM_Tridium',
  ],
};

export const LAB_NAME_FILTERS = {
  all: 'all',
  issacs: 'issacs',
  falvey: 'falvey',
  rodriguez: 'rodriguez',
  wang: 'wang',
};

export const LAB_NAMES = Object.values(LAB_NAME_FILTERS).filter(
  (name) => name !== LAB_NAME_FILTERS.all
);

export const LAB_NAME_LABELS = LAB_NAMES.map(
  (lab) => `${capitalizeString(lab)} Lab`
);

export const LAB_NUM_FUMEHOODS = {
  issacs: LAB_FUMEHOOD_MAPPING.issacs.length,
  falvey: LAB_FUMEHOOD_MAPPING.falvey.length,
  rodriguez: LAB_FUMEHOOD_MAPPING.rodriguez.length,
  wang: LAB_FUMEHOOD_MAPPING.wang.length,
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

export const TIME_GRANULARITIES = {
  none: 'none',
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'year',
};

export const TIME_OF_DAY = {
  all: 'all',
  day: 'day',
  night: 'night',
};

export const NUMBER_OF_COMPETITION_WEEKS = 4;

export const MIN_DATE = new Date('01/01/2000');
