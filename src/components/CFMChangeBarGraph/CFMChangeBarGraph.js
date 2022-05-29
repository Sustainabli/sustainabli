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
  LAB_NAMES,
  LAB_NUM_FUMEHOODS,
  LAB_ROOM_FILTERS,
  TIME_GRANULARITIES,
  NUM_OF_COMPETITION_WEEKS,
} from '../../utils/Constants.js';
import {
  calculateAmtEnergySaved,
  capitalizeString,
  formatDateLabel,
  generateChartOptions,
} from '../../utils/Utils.js';
import './CFMChangeBarGraph.scss';

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
      chartData: {},
      labels: [],
    }
  }

  componentDidMount() {
    const { weekData } = this.props;
    const labels = Object.values(LAB_NAMES).filter(lab => lab !== LAB_NAMES.all).map(lab => `${capitalizeString(lab)} Lab`);
    const labData = {};
    Object.keys(LAB_NAMES).filter(name => name !== LAB_NAMES.all).forEach(lab => {
      const toRet = [];
      weekData.forEach(datum => {
        toRet.push(Object.keys(datum)
          .filter(key => !key.includes("Total") && LAB_ROOM_FILTERS[lab].reduce((prev, curr) => prev || key.includes(curr), false))
          .reduce((prev, curr) => prev + datum[curr], 0) / LAB_NUM_FUMEHOODS[lab]);
      });
      labData[lab] = toRet;
    });

    const chartData = {};
    if (weekData.length > 0) {
      chartData.beginning = Object.keys(labData)
        .map(lab => labData[lab]
          .slice(0, labData[lab].length - NUM_OF_COMPETITION_WEEKS)
          .reduce((prev, curr) => prev + curr, 0) / (labData[lab].length - NUM_OF_COMPETITION_WEEKS));
      for (let i = NUM_OF_COMPETITION_WEEKS; i >= 1; i--) {
        const chartDatum = [];
        let chartKey = '';
        Object.values(labData).forEach(labDatum => {
          chartKey = weekData[weekData.length - i].time;
          chartDatum.push(labDatum[labDatum.length - i]);
        });
        chartData[chartKey] = chartDatum;
      }
    }

    this.setState({
      labels: labels,
      chartData: chartData,
    });
  }

  onRefChange = node => {
    const { chartData, labels } = this.state;

    let newBarGraph = node;
    if (node && node.getContext('2d')) {
      const options = generateChartOptions('Changes in CFM Averages Before and During the Competition', 'CO2 Emissions CFM', 'Labs');
      const CFMBarData = {
        type: 'barWithErrorBars',
        data: {
          labels,
          datasets: Object.keys(chartData).map((key, index) => {
            const label = key === "beginning" ? "January-March CFM Averages" : formatDateLabel(new Date(key), TIME_GRANULARITIES.week)
            return {
              label: label,
              data: chartData[key].map(yVal => {
                return {
                  y: yVal,
                  yMin: [yVal - 100, yVal - 50],
                  yMax: [yVal + 100, yVal + 50],
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
    const { labels, chartData } = this.state;
    return (
      <div className="CFM-Change-Bar-Graph">
        {chartData && Object.keys(chartData).length > 0 &&
          <canvas ref={this.onRefChange}/>
        }
        <br/>
        <br/>
        {
          labels.map((lab, index) => <div className="energy-saved-div" key={lab}> {`${lab} has saved ${calculateAmtEnergySaved(chartData, index)} kwh of energy this competition so far`}
            </div>
          )
        }
      </div>
    );
  }
}

export default CFMChangeBarGraph;
