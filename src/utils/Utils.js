import {
  // Other imports
  METRIC_TYPE_AIRFLOW,
  METRIC_TYPE_CARBON,
  METRIC_TYPE_COST,
  METRIC_TYPE_ENERGY,
  MIN_DATE,
  RELATIVE_TIME_RANGES_OPTIONS,
  TIME_GRANULARITIES,
} from './Constants.js';

// Format date into YYYY-MM-DDTHH:MM format
export const formatDateQueryDate = (time) => {
  // Sometimes we'll get passed a date object other times we'll get passed the time as a string
  // object, so we need to create a new date object to work with
  const date = new Date(time);
  const regex = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d/;

  // Get timezone offset from UTC
  const offset = date.getTimezoneOffset() * 60 * 1000;

  const localTime = new Date(date - offset);

  return regex.exec(localTime.toISOString())[0];
}


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

// Takes list of sash openness values and calculates the metric value average
export const convertSashOpennessToMetricValueAverage = (metricType, values) => {
  let toRet = 0;
  switch (metricType) {
    case METRIC_TYPE_ENERGY:
      toRet = ((values.length * 136 * 35.71) + 11 * 35.71 * (values.reduce((acc, value) => acc + value, 0))) / values.length;
      break;

    case METRIC_TYPE_CARBON:
      toRet = ((values.length * 136 * 13.771064) + 11 * 13.771064 * (values.reduce((acc, value) => acc + value, 0))) / values.length;
      break;

    case METRIC_TYPE_COST:
      toRet = ((values.length * 136 * 5) + 11 * 5 * (values.reduce((acc, value) => acc + value, 0))) / values.length;
      break;

    case METRIC_TYPE_AIRFLOW:
    default:
      toRet = ((values.length * 136) + 11 * (values.reduce((acc, value) => acc + value, 0))) / values.length;
      break;
  }
  return toRet.toFixed(2);
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
