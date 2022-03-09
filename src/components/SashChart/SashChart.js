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
import data from '../../mock-data/mock-sash.json';
import { CHART_COLORS } from '../../utils/Constants.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
);

class SashChart extends React.Component {
  render() {
    const labels = data.map(datum => new Date(datum.time).toLocaleString());

    // For now we are extracting keys from first entry. Likely first data entry might NOT have all keys so we need a better solution down the line
    // We also want to remove 'time' from the list of data keys (this simplifies looping through line graph keys)
    const dataKeys = Object.keys(data[0]).filter(key => key !== 'time');

    const sashData = {
      labels,
      datasets: dataKeys.map(key => {
        const colorIndex = dataKeys.indexOf(key);
        return {
          label: key,
          data: data.map(datum => datum[key]),
          borderColor:  CHART_COLORS[colorIndex],
          backgroundColor: `${CHART_COLORS[colorIndex]}80`,
        };
      })
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Sash Data',
        },
      },
    };
    return (
      <div className="Sash-Chart">
        <Line options={options} data={sashData}/>
      </div>
    );
  }
}

export default SashChart;
