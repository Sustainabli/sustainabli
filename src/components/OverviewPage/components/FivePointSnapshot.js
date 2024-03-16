import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function FivePointSnapshot(props) {
  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Number of Fume Hoods'
        }
      },
    },
  };

  const labels = ["Day 1", "Day 2", "Day 3"];

  const data = {
    labels,
    datasets: [
      {
        label: 'Closed',
        data: [4,10,15],
        backgroundColor: 'rgb(135, 211, 0)',
      },
      {
        label: '0-10cm',
        data: [10,12,18],
        backgroundColor: 'rgb(246,230,0)',
      },
      {
        label: '10-25cm',
        data: [8,5,3],
        backgroundColor: 'rgb(239,165,0)',
      },
      {
        label: '25-45cm',
        data: [10,5,2],
        backgroundColor: 'rgb(199,0,5)',
      },
      {
        label: '> 45cm',
        data: [7,7,1],
        backgroundColor: 'rgb(140,26,255)',
      }
    ],
  };

  return <Bar options={options} data={data}/>;
}

export default FivePointSnapshot;
