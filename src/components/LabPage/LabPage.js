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
import Container from 'react-bootstrap/Container';
import {
  CHART_TYPES,
  CHART_COLORS,
  LAB_NAMES,
  LAB_ROOM_FILTERS,
  RELATIVE_TIME_RANGES,
  TIME_GRANULARITIES,
  TIME_OF_DAY,
} from '../../utils/Constants.js';
import {
  capitalizeString,
  extractFumehoodName,
  fetchFilteredData,
  formatDateLabel,
  generateChartOptions,
} from '../../utils/Utils.js';
import './LabPage.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
);

class LabPage extends React.Component {
  constructor() {
    super();
    this.state = {
      lineGraphData: [],
    }
  }

  async componentDidMount() {
    const lineGraphFilters = {
      timeRange: RELATIVE_TIME_RANGES.one_month.value,
      timeOfDay: TIME_OF_DAY.all,
    }

    const fetchedLineGraphResponse = (await fetchFilteredData(TIME_GRANULARITIES.day, lineGraphFilters, CHART_TYPES.cfm));

    this.setState({
      lineGraphData: fetchedLineGraphResponse.data,
    });
  }

  render() {
    const { lab } = this.props;
    const { lineGraphData } = this.state;

    // X-axis labels
    const labels = lineGraphData.map(datum => formatDateLabel(new Date(datum.time), TIME_GRANULARITIES.day));

    // dataKeys will contain the fumehood names we want to look at
    // First check if the data has been loaded yet. If it hasn't either lineGraphData will be null or lineGraphData.length will be 0
    // We also want to remove 'time' from the list of data keys (this simplifies looping through line graph keys)
    // Also filter to only include data keys we're interested in (i.e. room numbers)
    let dataKeys = lineGraphData && lineGraphData.length ? Object.keys(lineGraphData[0]).filter(key => {
      if (key === 'time') {
        return false;
      }
      // When filtering across a specific lab average, do not look at total room data
      return LAB_ROOM_FILTERS[lab].reduce((acc, room) => acc || (key.includes(room) && !key.includes("Total")), false);
    }) : [];

    // Organize data into chartData. Format will look like
    //  - <key>: <array of data for each granularity point>
    const chartData = {};
    // When look at all labs, we need to take the average of all fumehood totals for each respective lab
    dataKeys.forEach(key => {
      chartData[key] = lineGraphData.map(datum => datum[key]);
    });

    const CFMData = {
      labels,
      datasets: Object.keys(chartData).map((key, index) => {
        const label = lab === LAB_NAMES.all ? capitalizeString(key) : extractFumehoodName(key);
        return {
          label: label,
          data: chartData[key],
          borderColor: CHART_COLORS[index],
          backgroundColor: `${CHART_COLORS[index]}80`,
        };
      })
    };

    const chartTitle = `Fumehood CFM Data for ${capitalizeString(lab)} Lab`;


    return (
      <Container fluid className="LabPage">
        <h1>{capitalizeString(lab)} Lab</h1>
        <br/>
        <Line options={generateChartOptions(chartTitle, 'CO2 Emissions CFM', 'Dates')} data={CFMData}/>
      </Container>
    );
  }
}

export default LabPage;
