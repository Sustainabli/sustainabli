import React from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CHART_COLORS } from '../../utils/Constants.js';
import { generateChartOptions, getSensorsData } from '../../utils/Utils.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
);

class DemoPage extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  async componentDidMount() {
    await this.getAndformatSensorsData();
    this.interval = setInterval(
      async () => await this.getAndformatSensorsData(),
      5000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getAndformatSensorsData = async () => {
    const data = await getSensorsData();
    const timeSet = new Set();
    data.forEach(datum =>
      datum.data.forEach(payload => timeSet.add(payload.time))
    );
    const timeList = [...timeSet].sort((date1, date2) => new Date(date1) - new Date(date2));
    data.forEach(datum => {
      const datumTimeList = datum.data.map(payload => payload.time);
      datum.data = timeList.map(time => ({
        time: time,
        value: datumTimeList.includes(time)
          ? datum.data.find(payload => payload.time === time).value
          : null,
      }));
    });
    this.setState({data: data});
  };

  /* updateSensorsData = async () => { */
  /*   this.setState({ data: await getSensorsData() }); */
  /* }; */

  // Choose the sensor datum with the largest number of timestamps as the x-labels for the graph
  getLabels = data => {
    let longest = [];
    data.forEach(datum => {
      if (datum.data.length > longest.length) {
        longest = datum.data.map(values => values.time);
      }
    });
    return longest;
  };

  render() {
    const { data } = this.state;
    const GraphData = {
      labels: this.getLabels(data),
      datasets: data.map((datum, index) => ({
        label: datum.sensor_name,
        data: datum.data.map(payload => payload.value),
        borderColor: CHART_COLORS[index],
        backgroundColor: `${CHART_COLORS[index]}80`,
      })),
    };

    return (
      <div className='Demo-Chart'>
        {data.length > 0 && (
          <Line
            options={generateChartOptions(
              'Sensors Data',
              'Percent Openness',
              'Time'
            )}
            data={GraphData}
          />
        )}
      </div>
    );
  }
}

export default DemoPage;
