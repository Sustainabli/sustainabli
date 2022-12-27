import React from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'react-toggle/style.css';
import {
  CHART_COLORS,
  LAB_NAME_FILTERS,
  TIME_GRANULARITIES,
} from '../../utils/Constants.js';
import {
  capitalizeString,
  extractFumehoodName,
  formatDateLabel,
  generateChartOptions,
} from '../../utils/Utils.js';
import './ChartTemplate.scss';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend
);

class ChartTemplate extends React.Component {
  render() {
    const { lab, filteredData, chartTitle, chartType } = this.props;

    // X-axis labels
    const labels = filteredData[Object.keys(filteredData)[0]].map((datum) =>
      formatDateLabel(new Date(datum.time), TIME_GRANULARITIES.day)
    );

    const CFMData = {
      labels,
      datasets: Object.keys(filteredData).map((key, index) => {
        const label =
          lab === LAB_NAME_FILTERS.all
            ? capitalizeString(key)
            : extractFumehoodName(key);
        return {
          label: label,
          data: filteredData[key].map((datum) => datum.value),
          borderColor: CHART_COLORS[index],
          backgroundColor: `${CHART_COLORS[index]}80`,
        };
      }),
    };

    return (
      <div className='CFM-Chart'>
        {chartType === "line" && <Line
          options={generateChartOptions(
            chartTitle,
            'CO2 Emissions CFM',
            'Dates'
          )}
          data={CFMData}
        />}
        {chartType === "bar" && <Bar
          options={generateChartOptions(
            chartTitle,
            'CO2 Emissions CFM',
            'Dates'
          )}
          data={CFMData}
        />}
      </div>
    );
  }
}

export default ChartTemplate;
