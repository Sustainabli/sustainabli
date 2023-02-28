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
  convertDataToMetricSingle,
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


class MetricsAreaChart extends React.Component {
  render() {
    const { labels2, data3, data } = this.props;

    const footer = (tooltipItems) => {
      let result = [];
      let metrics = ['cfm', 'energy', 'carbon']
      metrics.forEach((metric) => {
        result.push(`${metric.toUpperCase()}: ${convertDataToMetricSingle(METRIC_TYPES_MAP[metric], tooltipItems.parsed.y).toFixed(2)}`)
      })
      return result;
    };

    const options = {
      responsive: true,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          position: 'top',
          display: false,
        },
        title: {
          display: true,
          text: 'Metrics Overview Reductions',
          color: '#000000',
          font: {
            size: 30,
          },
        },
        tooltip: {
          callbacks: {
            label: footer,
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
        },
      }
    };
    let labels = []
    Object.values(data)[0].forEach((entry) => {
      labels.push(formatDateLabel(new Date(entry.time), TIME_GRANULARITIES.day))
    })

    const data2 = {
      labels,
      datasets: [
        {
          fill: true,
          label: 'CFM',
          data: Object.values(data)[0].map((entry) => entry.value),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'y',
          pointRadius: 0,
          lineTension: 0.5,
        },
        // {
        //   fill: true,
        //   label: 'ENERGY',
        //   data: Object.values(convertDataToMetric(METRIC_TYPES_MAP['energy'], data))[0].map((entry) => entry.value),
        //   borderColor: 'rgb(0, 153, 0)',
        //   backgroundColor: 'rgba(0, 153, 0, 0.5)',
        //   yAxisID: 'y1',
        //   pointRadius: 0,
        //   lineTension: 0.5,
        // },
      ],
    };

    return <Line options={options} data={data2} />;
  }

}
export default MetricsAreaChart
