import React from 'react';
import { } from '../../utils/Constants.js';
import { getSensorsData } from '../../utils/Utils';

class DemoPage extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    }
  }
  async componentDidMount() {
    this.setState({data: await getSensorsData() });
  }
  render() {
    const { data } = this.state;
    return (
      <div>
        {data.map((datum, index) => <div key={index}>sensor: {datum.sensor_name} time: {datum.time} value: {datum.value}</div>)}
      </div>
    )
  }
}

export default DemoPage;
