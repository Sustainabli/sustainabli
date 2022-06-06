import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CFMBarGraph from '../CFMBarGraph/CFMBarGraph';
import CFMLineGraph from '../CFMLineGraph/CFMLineGraph';
import FilterOptions from '../FilterOptions/FilterOptions';
import Header from './Header/Header';
import Rankings from './Rankings/Rankings';
import {
  CHART_TYPES,
  LAB_NAMES,
  RELATIVE_TIME_RANGES,
  TIME_GRANULARITIES,
  TIME_OF_DAY,
} from '../../utils/Constants.js';
import {
  capitalizeString,
  fetchFilteredData,
  getBarGraphData,
} from '../../utils/Utils.js';
import './HomePage.scss';

class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      barGraphData: [],
      barGraphLabels: [],
      lineGraphData: [],
      selectedTab: 'dashboard',
    }
  }

  async componentDidMount() {
    const barGraphFilters = {
      timeRange: RELATIVE_TIME_RANGES.all.value,
      timeOfDay: TIME_OF_DAY.all,
    }
    const lineGraphFilters = {
      timeRange: RELATIVE_TIME_RANGES.one_month.value,
      timeOfDay: TIME_OF_DAY.all,
    }

    const fetchedBarGraphResponse = await fetchFilteredData(TIME_GRANULARITIES.week, barGraphFilters, CHART_TYPES.cfm);
    const barGraphLabels = Object.values(LAB_NAMES).filter(lab => lab !== LAB_NAMES.all).map(lab => `${capitalizeString(lab)} Lab`);
    const fetchedLineGraphResponse = (await fetchFilteredData(TIME_GRANULARITIES.day, lineGraphFilters, CHART_TYPES.cfm));

    this.setState({
      barGraphData: getBarGraphData(fetchedBarGraphResponse),
      barGraphLabels: barGraphLabels,
      lineGraphData: fetchedLineGraphResponse.data,
    });
  }

  setFilteredLineGraphData = data => {
    this.setState({lineGraphData: data});
  }

  onChangeSelectedSelectedTab = key => {
    this.setState({selectedTab: key});
  }

  render() {
    const {
      barGraphData,
      barGraphLabels,
      lineGraphData,
      selectedTab
    } = this.state;

    return (
      <Container fluid className="HomePage">
        <Header selectedTab={selectedTab} onChangeSelectedTab={this.onChangeSelectedSelectedTab}/>
        {selectedTab === 'dashboard' ?
          <React.Fragment>
            <Row className="homepage-row">
              <Col md={5}>
                Asdf
              </Col>
              <Col md={7}>
                {Object.keys(barGraphData).length > 0 && <CFMBarGraph barGraphData={barGraphData} barGraphLabels={barGraphLabels}/>}
              </Col>
            </Row>
            <br/>
            <Row className="homepage-row">
              <Col md={2}>
                <FilterOptions setFilteredLineGraphData={this.setFilteredLineGraphData}/>
              </Col>
              <Col md={7}>
                {lineGraphData.length > 0 && <CFMLineGraph lab={LAB_NAMES.all} filteredData={lineGraphData}/>}
              </Col>
              <Col md={3}>
                {Object.keys(barGraphData).length > 0 && <Rankings barGraphData={barGraphData} barGraphLabels={barGraphLabels}/>}
              </Col>
            </Row>
          </React.Fragment>
        :
          <Row className='homepage-row'>Asdf</Row>}
      </Container>
    );
  }
}

export default HomePage;
