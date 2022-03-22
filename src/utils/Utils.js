// File contains several helper functions

// Fetches filtered data from database based on filters and data category
// TODO: For now data category will default to null since we only have sash data
export const fetchFilteredData = async (filters, category?=null) => {
  return fetch(`/${filters.granularity}`)
    .then(res => res.json())
}
