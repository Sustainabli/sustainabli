import { NONE, DAY, WEEK, MONTH, YEAR, ALL, SASH, CFM } from './Constants.js';

// File contains several helper functions

// Fetches filtered data from database based on filters and data category
// TODO: For now data category will default to null since we only have sash data
export const fetchFilteredData = async (filters, category) => {
  // Parse out which fields we want from filters
  const { granularity, showDayData, relativeTimeRange } = filters;
  // We need to add offset for now since data is from 2018
  const useOffset = false;
  let fetchURL = `/${category}/${granularity}?`;
  fetchURL += showDayData ? '&time=day' : '&time=night';
  if (relativeTimeRange && relativeTimeRange !== ALL) {
    fetchURL += `&relative=${relativeTimeRange}`
  }
  if (useOffset) {
    fetchURL += `&offset=2018-10-19`
  }
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
    case NONE:
      return `${dateMonth}/${dateDay}/${dateYear}   ${dateHours}:${dateMinutes} ${ampm}`;
    case DAY:
      return `${dateMonth}/${dateDay}/${dateYear}`;
    case WEEK:
      return `${startWeekMonth}/${startWeekDay}/${startWeekYear} - ${endWeekMonth}/${endWeekDay}/${endWeekYear}`;
    case MONTH:
      return `${dateMonth}/${dateYear}`;
    case YEAR:
      return `${dateYear}`;
    default:
  }
}

export const convertCFMToSash = CFM => {
  return (CFM - 136) / 110;
}

export const generateChartOptions = chartType => {
  let chartTypeString = "";

  switch(chartType) {
    case SASH:
      chartTypeString = "Sash";
      break;
    case CFM:
      chartTypeString = "CFM";
      break;
    default:
  }

  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${chartTypeString} Data`,
        color: '#000000',
        font: {
          size: 30,
        }
      },
    },
  }
}
