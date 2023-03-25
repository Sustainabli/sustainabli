import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  capitalizeString,
  extractFumehoodName,
  formatDateLabel,
  generateChartOptions,
  convertDataToMetric,
} from '../../utils/Utils.js';

import {
  FETCH_DATA_URL,
  FETCH_SENSORS_DATA_URL,
  METRIC_TYPE_AIRFLOW,
  METRIC_TYPE_CARBON,
  METRIC_TYPE_COST,
  METRIC_TYPE_ENERGY,
  MIN_DATE,
  METRIC_TYPES_MAP,
  NUMBER_OF_COMPETITION_WEEKS,
  RELATIVE_TIME_RANGES_OPTIONS,
  TIME_GRANULARITIES,
} from '../../utils/Constants.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);


class CostAreaChart extends React.Component {
  render() {
    const { labels2, data3, data } = this.props;

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Annual Energy Cost Savings',
          color: '#000000',
          font: {
            size: 30,
          },
        },
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',

          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
      }
    };
    let labels = []
    Object.values(data)[0].forEach((entry) => {
      labels.push(formatDateLabel(new Date(entry.time), TIME_GRANULARITIES.day))
    })

    let dataValues = Object.values(convertDataToMetric(METRIC_TYPES_MAP['cost'], data))[0].map((entry) => entry.value)
    let sumValues = [...dataValues]
    for (let i = 1; i < sumValues.length; i += 1) {
      sumValues[i] += sumValues[i - 1]
    }
    const data2 = {
      labels,
      datasets: [
        {
          fill: true,
          label: 'Current Cost',
          data: dataValues,
          borderColor: 'rgb(176, 103, 244)',
          backgroundColor: 'rgba(176, 103, 244, 0.5)',
          yAxisID: 'y',
        },
        {
          fill: true,
          label: 'Total Cost',
          data: sumValues,
          borderColor: 'rgb(0, 153, 0)',
          backgroundColor: 'rgba(0, 153, 0, 0.5)',
          yAxisID: 'y1',
        },
      ],
    };

    return <Line options={options} data={data2} />;
  }

}
export default CostAreaChart
