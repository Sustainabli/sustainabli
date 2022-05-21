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
import { Bar } from 'react-chartjs-2';
import "react-toggle/style.css";
import {
  CHART_COLORS,
  CHART_TYPES,
  LAB_NAMES,
  LAB_NUM_FUMEHOODS,
  LAB_ROOM_FILTERS,
  RELATIVE_TIME_RANGES,
  TIME_GRANULARITIES,
  TIME_OF_DAY,
  NUM_OF_COMPETITION_WEEKS,
} from '../../utils/Constants.js';
import {
  capitalizeString,
  fetchFilteredData,
  formatDateLabel,
  generateChartOptions,
} from '../../utils/Utils.js';

ChartJS.register(
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
  }

  render() {
    const { weekData } = this.props;
    const options = generateChartOptions('Changes in CFM Averages Before and During the Competition');
    const labels = Object.values(LAB_NAMES).filter(lab => lab !== LAB_NAMES.all).map(lab => `${capitalizeString(lab)} Lab`);
    const labData = {};
    Object.keys(LAB_NAMES).filter(name => name !== LAB_NAMES.all).forEach(lab => {
      const toRet = [];
      weekData.forEach(datum => {
        toRet.push(Object.keys(datum)
          .filter(key => key.includes("Total") && LAB_ROOM_FILTERS[lab].reduce((prev, curr) => prev || key.includes(curr), false))
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
    const CFMBarData = {
      labels,
      datasets: Object.keys(chartData).map((key, index) => {
        const label = key === "beginning" ? "January-March CFM Averages" : formatDateLabel(new Date(key), TIME_GRANULARITIES.week)
        return {
          label: label,
          data: chartData[key],
          borderColor: CHART_COLORS[index],
          backgroundColor: `${CHART_COLORS[index]}80`,
        }
      }),
    };

    return (
      <div className="CFM-Change-Bar-Graph">
        <Bar options={options} data={CFMBarData}/>
        <br/>
        <br/>
      {/*
        <div>
          Issacs Lab has saved {((oldDataForChart[0] - newDataForChart[0]) * 35.71 / 52).toFixed(2)} kwh of energy this competition so far
        </div>
        <br/>
        <div>
          Falvey Lab has saved {((oldDataForChart[1] - newDataForChart[1]) * 35.71 / 52).toFixed(2)} kwh of energy this competition so far
        </div>
        <br/>
        <div>
          Rodriguez Lab has saved {((oldDataForChart[2] - newDataForChart[2]) * 35.71 / 52).toFixed(2)} kwh of energy this competition so far
        </div>
        <br/>
        <div>
          Wang Lab has saved {((oldDataForChart[3] - newDataForChart[3]) * 35.71 / 52).toFixed(2)} kwh of energy this competition so far
        </div>
        <br/>
        */}
      </div>
    );
  }
}


export default CFMChangeBarGraph;
