import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BarWithErrorBarsController, BarWithErrorBar } from 'chartjs-chart-error-bars';
import "react-toggle/style.css";
import {
  CHART_COLORS,
  TIME_GRANULARITIES,
} from '../../utils/Constants.js';
import {
  formatDateLabel,
  generateChartOptions,
} from '../../utils/Utils.js';
import './CFMBarGraph.scss';

ChartJS.register(
  BarWithErrorBarsController,
  BarWithErrorBar,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

class CFMChangeBarGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barGraphRef: null,
    }
  }

  onRefChange = node => {
    const { barGraphData, barGraphLabels } = this.props;

    let newBarGraph = node;
    if (barGraphLabels.length > 0 && node && node.getContext('2d')) {
      const options = generateChartOptions('Changes in CFM Averages Before and During the Competition', 'CO2 Emissions CFM', 'Labs');
      const CFMBarData = {
        type: 'barWithErrorBars',
        data: {
          labels: barGraphLabels,
          datasets: Object.keys(barGraphData).map((key, index) => {
            const label = key === "beginning" ? "January-March CFM Averages" : formatDateLabel(new Date(key), TIME_GRANULARITIES.week)
            return {
              label: label,
              data: barGraphData[key].map(yVal => {
                return {
                  y: yVal,
                  // yMin: [yVal - 100, yVal - 50],
                  // yMax: [yVal + 100, yVal + 50],
                }
              }),
              borderColor: CHART_COLORS[index],
              backgroundColor: `${CHART_COLORS[index]}80`,
            }
          }),
        },
        options: options,
      };
      newBarGraph = new ChartJS(node.getContext('2d'), CFMBarData);
    }
    this.setState({ barGraphRef: newBarGraph });
  }

  render() {
    return (
      <div className="CFM-Change-Bar-Graph">
      <canvas ref={this.onRefChange}/>
      </div>
    );
  }
}

export default CFMChangeBarGraph;
