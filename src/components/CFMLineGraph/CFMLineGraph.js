import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'react-toggle/style.css';
import {
  ALL_LAB_ROOMS,
  CHART_COLORS,
  LAB_NAMES,
  LAB_NAMES_FILTERS,
  LAB_NUM_FUMEHOODS,
  LAB_ROOM_FILTERS,
  TIME_GRANULARITIES,
} from '../../utils/Constants.js';
import {
  capitalizeString,
  extractFumehoodName,
  formatDateLabel,
  generateChartOptions,
} from '../../utils/Utils.js';
import './CFMLineGraph.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
);

class CFMLineGraph extends React.Component {
  render() {
    const { lab, filteredData } = this.props;

    // X-axis labels
    const labels = filteredData.map((datum) =>
      formatDateLabel(new Date(datum.time), TIME_GRANULARITIES.day)
    );

    // dataKeys will contain the fumehood names we want to look at
    // First check if the data has been loaded yet. If it hasn't either filteredData will be null or filteredData.length will be 0
    // We also want to remove 'time' from the list of data keys (this simplifies looping through line graph keys)
    // Also filter to only include data keys we're interested in (i.e. room numbers)
    let dataKeys =
      filteredData && filteredData.length
        ? Object.keys(filteredData[0]).filter((key) => {
            if (key === 'time') {
              return false;
            }
            if (lab === LAB_NAMES_FILTERS.all) {
              // Look at all individual fumehood data. For some reason the Total ones are inaccurate
              return ALL_LAB_ROOMS.reduce(
                (acc, room) =>
                  acc || (key.includes(room) && !key.includes('Total')),
                false
              );
            } else {
              // When filtering across a specific lab average, do not look at total room data
              return LAB_ROOM_FILTERS[lab].reduce(
                (acc, room) =>
                  acc || (key.includes(room) && !key.includes('Total')),
                false
              );
            }
          })
        : [];

    // Organize data into chartData. Format will look like
    //  - <key>: <array of data for each granularity point>
    const chartData = {};
    // When look at all labs, we need to take the average of all fumehood totals for each respective lab
    if (lab === LAB_NAMES_FILTERS.all) {
      LAB_NAMES.forEach((lab) => {
        const toRet = [];
        filteredData.forEach((datum) => {
          toRet.push(
            Object.keys(datum)
              .filter(
                (key) =>
                  !key.includes('Total') &&
                  LAB_ROOM_FILTERS[lab].reduce(
                    (prev, curr) => prev || key.includes(curr),
                    false
                  )
              )
              .reduce((prev, curr) => prev + datum[curr], 0) /
              LAB_NUM_FUMEHOODS[lab]
          );
        });
        chartData[lab] = toRet;
      });
      // When looking at an individual lab, we can just take the granularity data points
    } else {
      dataKeys.forEach((key) => {
        chartData[key] = filteredData.map((datum) => datum[key]);
      });
    }

    const CFMData = {
      labels,
      datasets: Object.keys(chartData).map((key, index) => {
        const label =
          lab === LAB_NAMES_FILTERS.all
            ? capitalizeString(key)
            : extractFumehoodName(key);
        return {
          label: label,
          data: chartData[key],
          borderColor: CHART_COLORS[index],
          backgroundColor: `${CHART_COLORS[index]}80`,
        };
      }),
    };

    const chartTitle =
      lab === LAB_NAMES_FILTERS.all
        ? 'Average CFM per Lab'
        : `Fumehood CFM Data for ${capitalizeString(lab)} Lab`;

    return (
      <div className='CFM-Chart'>
        <Line
          options={generateChartOptions(
            chartTitle,
            'CO2 Emissions CFM',
            'Dates'
          )}
          data={CFMData}
        />
      </div>
    );
  }
}

export default CFMLineGraph;
