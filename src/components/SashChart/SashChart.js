import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Toggle from 'react-toggle'
import "react-toggle/style.css"


import data from '../../mock-data/mock-sash.json';
import { CHART_COLORS } from '../../utils/Constants.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
);

class SashChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDayData: false,
    };
  }

  filterDayNightData = (datum, showDay) => {
    const date = new Date(datum['time']);
    const dateHour = date.getHours();
    if (showDay) {
      return dateHour > 6 && dateHour < 18;
    }
    return dateHour <= 6 || dateHour >= 18;
  }

  render() {
    const {showDayData} = this.state;
    const labels = data.filter(datum => this.filterDayNightData(datum, showDayData)).map(datum => new Date(datum.time).toLocaleString());

    // For now we are extracting keys from first entry. Likely first data entry might NOT have all keys so we need a better solution down the line
    // We also want to remove 'time' from the list of data keys (this simplifies looping through line graph keys)
    const dataKeys = Object.keys(data[0]).filter(key => key !== 'time');

    const sashData = {
      labels,
      datasets: dataKeys.map(key => {
        const colorIndex = dataKeys.indexOf(key);
        return {
          label: key,
          // data: data.map(datum => datum[key]),
          data: data.filter(datum => this.filterDayNightData(datum, showDayData)).map(datum => datum[key]),
          borderColor:  CHART_COLORS[colorIndex],
          backgroundColor: `${CHART_COLORS[colorIndex]}80`,
        };
      })
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Sash Data',
        },
      },
    };
    return (
      <div className="Sash-Chart">
        <Toggle
          id='show-day-data'
          defaultChecked={showDayData}
          onChange={() => this.setState({showDayData: !showDayData})}
        />
        <br/>
        <label htmlFor='show-day-data'>Show Day Data</label>
        <Line options={options} data={sashData}/>
      </div>
    );
  }
}

export default SashChart;
