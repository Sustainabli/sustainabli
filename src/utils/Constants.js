// distinct color hexes. If we need more look at https://stackoverflow.com/questions/1168260/algorithm-for-generating-unique-colors
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
]

// Constants for time granularity
export const NONE = "none";
export const DAY = "day";
export const WEEK = "week";
export const MONTH = "month";
export const YEAR = "year";
export const TIME_GRANULARITIES = [NONE, DAY, WEEK, MONTH, YEAR];

// Constants for time range interval
export const ALL = "all";
export const ONE_DAY = "1day"
export const THREE_DAYS = "3day"
export const ONE_WEEK = "7day"
export const ONE_MONTH = "1month"
export const ONE_YEAR = "1year"
export const RELATIVE_TIME_RANGES = [ALL, ONE_DAY, THREE_DAYS, ONE_WEEK, ONE_MONTH, ONE_YEAR];

// Constants for graph types
export const SASH = "sash";
export const CFM = "cfm";

export const ROOM_FILTERS = {
  all: "all",
  issacs: ["3336"],
  rodriguez: ["2360", "2364", "2368"],
  falvey: ["3356"],
  wang: ["1302", "1308"],
}

export const NUM_FUMEHOODS = {
  issacs: 4,
  rodriguez: 10,
  falvey: 4,
  wang: 17,
}

export const ALL_ROOMS = Object.values(ROOM_FILTERS).reduce((prev, curr) => prev.concat(curr), []);

export const DAY_DATA = "day";
export const NIGHT_DATA = "night";
export const ALL_DAY_DATA = "";
