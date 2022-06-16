import { capitalizeString } from "./Utils";

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

export const CHART_TYPES = {
  sash: 'sash',
  cfm: 'cfm',
};

export const LAB_NAMES_FILTERS = {
  all: 'all',
  issacs: 'issacs',
  falvey: 'falvey',
  rodriguez: 'rodriguez',
  wang: 'wang',
};

export const LAB_NAMES = Object.values(LAB_NAMES_FILTERS).filter(
  (name) => name !== LAB_NAMES_FILTERS.all
);

export const LAB_NAME_LABELS = LAB_NAMES.map(lab => `${capitalizeString(lab)} Lab`);

export const LAB_ROOM_FILTERS = {
  issacs: ['3336'],
  falvey: ['3356'],
  rodriguez: ['2360', '2364', '2368'],
  wang: ['1302', '1308'],
};

export const ALL_LAB_ROOMS = Object.values(LAB_ROOM_FILTERS).reduce(
  (prev, curr) => prev.concat(curr),
  []
);

export const LAB_NUM_FUMEHOODS = {
  issacs: 3,
  falvey: 4,
  rodriguez: 10,
  wang: 17,
};

export const RELATIVE_TIME_RANGES = {
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

export const NUM_OF_COMPETITION_WEEKS = 4;
