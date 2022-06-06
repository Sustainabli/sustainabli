import {
  LAB_NAMES,
  LAB_NUM_FUMEHOODS,
  LAB_ROOM_FILTERS,
  NUM_OF_COMPETITION_WEEKS,
  RELATIVE_TIME_RANGES,
  TIME_GRANULARITIES,
  TIME_OF_DAY,
} from './Constants.js';

/*
 ** File contains several helper functions
*/


// Capitalizes the first letter of a string
export const capitalizeString = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Calculate how much energy has been saved based on the given chartData
// chartData will come in the form of
//  - <Before competition>: <array of data points per lab>
//  - <Week 1 of competition>: <array of data points per lab>
//  - <Week 2 of competition>: <array of data points per lab>
//  - ...
// Assume that the array fo data points are in the correct order so we can index into it to retrieve data from a specific lab
// Also assume that the chartData weeks are sorted correctly, so the last key should be the latest week
export const calculateAmtEnergySaved = (chartData, index) => {
  const keys = Object.keys(chartData);
  return ((chartData.beginning[index] - chartData[keys[keys.length - 1]][index]) * 357.1 / 52).toFixed(2);
}

// Calculation for converting CFM data to Sash data
export const convertCFMToSash = CFM => {
  return (CFM - 136) / 110;
}

// Extracts the fumehood name from a given string
// e.g. FMGTAP012L01_B091_ChemistryW3_Room1302_FumeHood4_ExhaustCFM_Tridium becomes Room1302_FumeHood4
export const extractFumehoodName = name => {
  const regMatch = name.match(/(Room.*FumeHood\d)/);
  return regMatch[1];
}

// Fetches filtered data from database based on filters and data category
export const fetchFilteredData = async (granularity, filters, category) => {
  // Parse out which fields we want from filters
  const {
    timeRange,
    timeOfDay,
  } = filters;

  let fetchURL = `/${category}/${granularity}?`;
  if (timeOfDay !== TIME_OF_DAY.all) {
    fetchURL += `&time=${timeOfDay}`;
  }
  if (timeRange && timeRange !== RELATIVE_TIME_RANGES.all.value) {
    fetchURL += `&relative=${timeRange}`
  }
  // if (filters.dateOffset) {
  //   fetchURL += `&offset=${filters.dateOffset}`
  // }
  return fetch(fetchURL).then(res => res.json());
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
  let startWeekDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - startWeekOffset);
  const startWeekMonth = startWeekDate.getUTCMonth() + 1;
  const startWeekDay = startWeekDate.getUTCDate();
  const startWeekYear = startWeekDate.getUTCFullYear();
  let endWeekDate = new Date(date.getFullYear(), date.getMonth(), startWeekDate.getDate() + 6);
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
}

// Generate default chart options
// Accepts the chart ttile, y axis label, and x axis label
export const generateChartOptions = (title, yLabel, xLabel) => {
  return {
    animation: {
      duration: 0
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        color: '#000000',
        font: {
          size: 30,
        }
      },
    },
    scales: {
      x: {
        title: {
          display: 'true',
          text: xLabel,
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: 'true',
          text: yLabel,
        }
      }
    },
  }
}

// Extracts bar graph data
export const getBarGraphData = barGraphFetchResponse => {
  const barGraphData = barGraphFetchResponse.data;
  const labData = {};
  Object.keys(LAB_NAMES).filter(name => name !== LAB_NAMES.all).forEach(lab => {
    const toRet = [];
    barGraphData.forEach(datum => {
      toRet.push(Object.keys(datum)
        .filter(key => !key.includes("Total") && LAB_ROOM_FILTERS[lab].reduce((prev, curr) => prev || key.includes(curr), false))
        .reduce((prev, curr) => prev + datum[curr], 0) / LAB_NUM_FUMEHOODS[lab]);
    });
    labData[lab] = toRet;
  });


  const barGraphStats = barGraphFetchResponse.stats;
  const labStats = {};
  Object.keys(LAB_NAMES).filter(name => name !== LAB_NAMES.all).forEach(lab => {
    const toRet = [];
    Object.keys(barGraphStats)
      .filter(key => !key.includes("Total") && LAB_ROOM_FILTERS[lab].reduce((prev, curr) => prev || key.includes(curr), false))
      .forEach(key => {
        toRet.push(barGraphStats[key]);
    });
    labStats[lab] = toRet;
  });
  console.log(labStats);

  const chartData = {};
  chartData.beginning = Object.keys(labData)
    .map(lab => labData[lab]
      .slice(0, labData[lab].length - NUM_OF_COMPETITION_WEEKS)
      .reduce((prev, curr) => prev + curr, 0) / (labData[lab].length - NUM_OF_COMPETITION_WEEKS));
  for (let i = NUM_OF_COMPETITION_WEEKS; i >= 1; i--) {
    const chartDatum = [];
    let chartKey = '';
    Object.values(labData).forEach(labDatum => {
      chartKey = barGraphData[barGraphData.length - i].time;
      chartDatum.push(labDatum[labDatum.length - i].toFixed(2));
    });
    chartData[chartKey] = chartDatum;
  }
  return chartData;
}
