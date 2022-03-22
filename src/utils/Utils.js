// File contains several helper functions

// Fetches filtered data from database based on filters and data category
// TODO: For now data category will default to null since we only have sash data
export const fetchFilteredData = async (filters, category?=null) => {
  // Parse out which fields we want from filters
  const {granularity, timeRange} = filters;
  // We need to add offset for now since data is from 2018
  const useOffset = true;
  let fetchURL = `/${granularity}`;
  if (timeRange) {
    fetchURL += `?relative=${timeRange}`
  }
  if (timeRange && useOffset) {
    fetchURL += `&offset=2018-10-11`
  }
  return fetch(fetchURL)
    .then(res => res.json())
}
