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
  METRIC_TYPES_MAP,
  SINGLE_CHART_BACKGROUND_COLOR,
  SINGLE_CHART_BORDER_COLOR,
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
    const options = generateChartOptions('Metrics Overview Reductions', 'Average Sash Height (%)', 'Date', tooltipLabels);

    // TODO this needs to be able to display several different line graphs with different colors. Refer to code in https://github.com/Sustainabli/sustainabli/blob/61f18f9149b96a21ed9f437f32fcf0bf8ba010ea/src/components/CFMLineGraph/CFMLineGraph.js
    // TODO add fumehood name as label within datasets object
    const areaChartData = {
      labels: data.map((datum, i) => formatDateLabel(new Date(datum.time), TIME_GRANULARITIES.day)),
      datasets: [
        {
          fill: true,
          data: data.map(datum => Object.values(datum.data).reduce((acc, value) => acc + value)),
          borderColor: SINGLE_CHART_BORDER_COLOR,
          backgroundColor: SINGLE_CHART_BACKGROUND_COLOR,
          pointRadius: 0,
          lineTension: 0.5,
        },
      ],
    };

    return <Line options={options} data={areaChartData} />;
  }
}
export default MetricsLineGraph;
