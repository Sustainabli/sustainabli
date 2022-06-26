import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../Header/Header';
import Dashboard from './Dashboard/Dashboard.js';
import CompetitionRules from './CompetitionRules/CompetitionRules.js';
import {
  COMPETITION_START_DATE,
  DATA_FORMATS,
  DATA_TYPES,
  GRAPH_TYPES,
  LAB_FUMEHOOD_MAPPING,
  RELATIVE_TIME_RANGES_OPTIONS,
  TIME_GRANULARITIES,
  TIME_OF_DAY,
} from '../../utils/Constants.js';
import { fetchFilteredData, getOffsettedStartDate } from '../../utils/Utils.js';
import './HomePage.scss';

class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      barGraphData: [],
      lineGraphData: [],
      selectedTab: 'dashboard',
    };
  }

  async componentDidMount() {
    const lineStartDate = getOffsettedStartDate(
      new Date(),
      RELATIVE_TIME_RANGES_OPTIONS.one_month.value
    );

    const lineResponse = await fetchFilteredData(
      DATA_TYPES.cfm,
      DATA_FORMATS.allLabs,
      GRAPH_TYPES.line,
      TIME_GRANULARITIES.day,
      TIME_OF_DAY.all,
      LAB_FUMEHOOD_MAPPING,
      lineStartDate
    );

    const barResponse = await fetchFilteredData(
      DATA_TYPES.cfm,
      DATA_FORMATS.allLabs,
      GRAPH_TYPES.bar,
      TIME_GRANULARITIES.week,
      TIME_OF_DAY.all,
      LAB_FUMEHOOD_MAPPING,
      COMPETITION_START_DATE
    );

    this.setState({
      lineGraphData: lineResponse.data,
      barGraphData: barResponse.data,
    });
  }

  setFilteredLineGraphData = (data) => {
    this.setState({ lineGraphData: data });
  };

  onChangeSelectedSelectedTab = (key) => {
    this.setState({ selectedTab: key });
  };

  render() {
    const { barGraphData, lineGraphData, selectedTab } = this.state;

    return (
      <Container fluid className='HomePage'>
        <Header
          pageName='Home'
          selectedTab={selectedTab}
          onChangeSelectedTab={this.onChangeSelectedSelectedTab}
        />
        {selectedTab === 'dashboard' && (
          <Dashboard
            barGraphData={barGraphData}
            lineGraphData={lineGraphData}
            setFilteredLineGraphData={this.setFilteredLineGraphData}
          />
        )}
        {selectedTab === 'rules' && (
          <CompetitionRules />
        )}
      </Container>
    );
  }
}

export default HomePage;
