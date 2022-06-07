// Distinct color hexes. If we need more look at https://stackoverflow.com/questions/1168260/algorithm-for-generating-unique-colors
export const CHART_COLORS = [
  '#000000',
  '#00FF00',
  '#0000FF',
  '#FF0000',
  '#01FFFE',
  '#FFA6FE',
  '#FFDB66',
  '#006401',
  '#010067',
  '#95003A',
  '#007DB5',
  '#FF00F6',
  '#FFEEE8',
  '#774D00',
  '#90FB92',
  '#0076FF',
  '#D5FF00',
  '#FF937E',
  '#6A826C',
  '#FF029D',
  '#FE8900',
  '#7A4782',
  '#7E2DD2',
  '#85A900',
  '#FF0056',
  '#A42400',
  '#00AE7E',
  '#683D3B',
  '#BDC6FF',
  '#263400',
  '#BDD393',
  '#00B917',
  '#9E008E',
  '#001544',
  '#C28C9F',
  '#FF74A3',
  '#01D0FF',
  '#004754',
  '#E56FFE',
  '#788231',
  '#0E4CA1',
  '#91D0CB',
  '#BE9970',
  '#968AE8',
  '#BB8800',
  '#43002C',
  '#DEFF74',
  '#00FFC6',
  '#FFE502',
  '#620E00',
  '#008F9C',
  '#98FF52',
  '#7544B1',
  '#B500FF',
  '#00FF78',
  '#FF6E41',
  '#005F39',
  '#6B6882',
  '#5FAD4E',
  '#A75740',
  '#A5FFD2',
  '#FFB167',
  '#009BFF',
  '#E85EBE',
];

export const CHART_TYPES = {
  sash: 'sash',
  cfm: 'cfm',
};

export const LAB_NAMES = {
  all: 'all',
  issacs: 'issacs',
  falvey: 'falvey',
  rodriguez: 'rodriguez',
  wang: 'wang',
}

export const LAB_ROOM_FILTERS = {
  all: 'all',
  issacs: ['3336'],
  falvey: ['3356'],
  rodriguez: ['2360', '2364', '2368'],
  wang: ['1302', '1308'],
};

export const ALL_LAB_ROOMS = Object.values(LAB_ROOM_FILTERS).reduce((prev, curr) => prev.concat(curr), []);

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
    label: 'Past 3 Days'
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
  night: 'night'
};

export const NUM_OF_COMPETITION_WEEKS = 4;
