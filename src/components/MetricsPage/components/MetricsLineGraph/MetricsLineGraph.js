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
  CHART_COLORS,
  METRIC_TYPES_MAP,
  TIME_GRANULARITIES,
} from '../../../../utils/Constants.js';
import {
  convertSashHeightToMetricValue,
  formatDateLabel,
  generateChartOptions,
} from '../../../../utils/Utils.js';

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


class MetricsLineGraph extends React.Component {
  render() {
    const { data } = this.props;

    const tooltipLabels = tooltipItems =>
      Object.values(METRIC_TYPES_MAP).map(metric =>
        `${metric.type.toUpperCase()}: ${convertSashHeightToMetricValue(metric.type, tooltipItems.parsed.y).toFixed(2)} ${metric.unit}`
      )
    ;
    const options = generateChartOptions('Metrics Overview', 'Average Sash Height (%)',
        'Date', tooltipLabels);

    const areaChartData = {
      labels: data.map((datum, i) => formatDateLabel(new Date(datum.time), TIME_GRANULARITIES.day)),
      datasets: Object.keys(data[0].data).map((fumeHood, index) => ({
          label: fumeHood,
          fill: true,
          data: data.map((datum) => datum.data[fumeHood]),
          borderColor: CHART_COLORS[index],
          backgroundColor: `${CHART_COLORS[index]}80`,
          pointRadius: 0,
          lineTension: 0.5,
      }))
    };

    return <Line options={options} data={areaChartData} />;
  }
}
export default MetricsLineGraph;
