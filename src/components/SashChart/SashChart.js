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
import data from '../../HVAC_Mock_Data.json';

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
    // For now we are using the dates in the mock data as labels. We need to aggregate this over months e.g. January
    const labels = data.map(datum => datum.date);
    const sashData = {
      labels,
      datasets: [
        {
          label: "Sash Data",
          data: data.map(datum => datum.sash),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }
      ]
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
