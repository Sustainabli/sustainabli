import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
// import faker from "faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

class SashStackChart extends React.Component {
  render() {
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Real-Time Sash Monitoring',
          color: '#000000',
          font: {
            size: 30,
          },
        }
      },
      responsive: true,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    };

    const labels = ["January", "February", "March", "April", "May", "June", "July"];

    const data = {
      labels,
      datasets: [
        {
          label: "Dataset 1",
          data: [12, 24, 65, 23, 54, 43, 34],
          backgroundColor: "rgb(27, 25, 25)"
        },
        {
          label: "Dataset 2",
          data: [43, 23, 94, 34, 12, 5, 36],
          backgroundColor: "rgb(208, 21, 21)"
        },
      ]
    };

    return <Bar options={options} data={data} />;

  }
}

export default SashStackChart

