import { ALL } from './Constants.js';

// File contains several helper functions

// Fetches filtered data from database based on filters and data category
// TODO: For now data category will default to null since we only have sash data
export const fetchFilteredData = async (filters, category?= null) => {
  // Parse out which fields we want from filters
  const { granularity, showDayData, relativeTimeRange } = filters;
  // We need to add offset for now since data is from 2018
  const useOffset = true;
  let fetchURL = `/${granularity}?`;
  fetchURL += showDayData ? '&time=day' : '&time=night';
  if (relativeTimeRange && relativeTimeRange !== ALL) {
    fetchURL += `&relative=${relativeTimeRange}`
  }
  if (useOffset) {
    fetchURL += `&offset=2018-10-19`
  }
  return fetch(fetchURL)
    .then(res => res.json())
}
