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
import "react-toggle/style.css";

import {
  CHART_COLORS,
  CFM,
  ROOM_FILTERS,
  ALL_ROOMS,
} from '../../utils/Constants.js';
import {
  formatDateLabel,
  generateChartOptions
} from '../../utils/Utils.js';

import './CFMChart.scss';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend
);

class CFMChart extends React.Component {

    render() {
        const { filters, filteredData } = this.props;
        const labels = filteredData.map(datum => formatDateLabel(new Date(datum.time), filters.granularity));

        // First check if the data has been loaded yet. If it hasn't either filteredData will be null or filteredData.length will be 0
        // We also want to remove 'time' from the list of data keys (this simplifies looping through line graph keys)
        // Limiting to first 10 data columns so we don't overload the app
        const dataKeys = filteredData && filteredData.length ? Object.keys(filteredData[0]).filter(key => key !== 'time').filter(key => {
          if (filters.selectedLab === "all") {
            let toFilter = false;
            ALL_ROOMS.forEach(room => {
              if (key.includes(room) && key.includes("Total")) {
                toFilter = true;
              }
            });
            return toFilter;
          } else {
            let toFilter = false;
            ROOM_FILTERS[filters.selectedLab].forEach(room => {
              if (key.includes(room) && (!key.includes("Total"))) {
                toFilter = true;
              }
            });
            return toFilter;
          }
        }) : [];

        const CFMData = {
          labels,
          datasets: dataKeys.map(key => {
            const colorIndex = dataKeys.indexOf(key);
            return {
              label: key,
              data: filteredData.map(datum => datum[key]),
              borderColor: CHART_COLORS[colorIndex],
              backgroundColor: `${CHART_COLORS[colorIndex]}80`,
            };
          })
        };

        return (
            <div className="CFM-Chart">
                <Line options={generateChartOptions(CFM)} data={CFMData} />
            </div>
        );
    }
}

export default CFMChart;
