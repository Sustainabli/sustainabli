import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import CFMChart from './components/CFMChart/CFMChart';
import CFMChangeBarGraph from './components/CFMChangeBarGraph/CFMChangeBarGraph';
import FilterOptions from './components/FilterOptions/FilterOptions';
import HomePage from './components/HomePage/HomePage';
import { NavDrawer } from './components/NavDrawer/NavDrawer';
// import SashChart from './components/SashChart/SashChart';
import {
  CHART_TYPES,
  LAB_ROOM_FILTERS,
  LAB_NAMES,
  RELATIVE_TIME_RANGES,
  TIME_GRANULARITIES,
  TIME_OF_DAY,
} from './utils/Constants.js';
import {
  fetchFilteredData,
} from './utils/Utils.js';
import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        selectedLab: LAB_ROOM_FILTERS.all,
        granularity: TIME_GRANULARITIES.day,
        timePeriod: RELATIVE_TIME_RANGES.all,
        timeOfDay: TIME_OF_DAY.all,
      },
      // These are the filters the user has SELECTED but hasn't SUBMITTED on the filter modal
      tempFilters: {
        selectedLab: LAB_ROOM_FILTERS.all,
        granularity: TIME_GRANULARITIES.day,
        timePeriod: RELATIVE_TIME_RANGES.all,
        timeOfDay: TIME_OF_DAY.all,
      },
      filteredData: [], // For CFM Line Graph
      weekData: [],     // For CFM Bar Graph
      pathname: null,   // Need to default null here otherwise the title for the bar graph shows up for a split second when looking at a specific lab URL
    }
  }

  async componentDidMount() {
    const { filters } = this.state;

    // Pathname will used to determine the specific lab url for the arduino display
    const pathname = Object.values(LAB_NAMES).filter(lab => lab !== LAB_NAMES.all).reduce((acc, lab) => window.location.pathname === `/${lab}` ? lab : acc, '');
    filters.selectedLab = pathname === '' ? LAB_NAMES.all : pathname;

    const weekFilters = {
      granularity: TIME_GRANULARITIES.week,
      timePeriod: RELATIVE_TIME_RANGES.all,
      timeOfDay: TIME_OF_DAY.all,
    }

    this.setState({
      filteredData: await fetchFilteredData(filters, CHART_TYPES.cfm),
      weekData: await fetchFilteredData(weekFilters, CHART_TYPES.cfm),
      filters: {...filters},
      pathname: pathname,
    });
  }

  // This fxn only updates tempFilters
  onChangeTempSelectedLab = lab => {
    const { tempFilters } = this.state;
    tempFilters.selectedLab = lab;
    this.setState({ tempFilters: { ...tempFilters } });
  }

  // This fxn only updates tempFilters
  onChangeTempGranularity = granularity => {
    const { tempFilters } = this.state;
    tempFilters.granularity = granularity;
    this.setState({ tempFilters: { ...tempFilters } });
  }

  // This fxn only updates tempFilters
  onChangeTempTimePeriod = period => {
    const { tempFilters } = this.state;
    tempFilters.timePeriod = period;
    this.setState({ tempFilters: { ...tempFilters } });
  }

  // This fxn only updates tempFilters
  onChangeTempTimeOfDay = timeOfDay => {
    const { tempFilters } = this.state;
    tempFilters.timeOfDay = timeOfDay;
    this.setState({ tempFilters: { ...tempFilters } });
  }

  // This fxn will update the actual filters
  onSubmitUpdateFilters = async () => {
    const { tempFilters } = this.state;
    this.setState({
      filters: { ...tempFilters },
      filteredData: await fetchFilteredData(tempFilters, CHART_TYPES.cfm)
    });
  }

  render() {
    const { filters, filteredData, weekData, pathname } = this.state;

    return (
      <Container className='App' fluid>
        <Row className="root-row">
          <Col as={NavDrawer} md={2}/>
          <Col md={10} className="root-right-col">
            <Router>
              <Routes>
                <Route exact path="/" element={<HomePage/>}/>
              </Routes>
            </Router>
          </Col>
        </Row>
                {/*<SashChart />*/}
      {/* <Col md={2}>
            <FillerOptions
              onChangeTempSelectedLab={this.onChangeTempSelectedLab}
              onChangeTempGranularity={this.onChangeTempGranularity}
              onChangeTempTimePeriod={this.onChangeTempTimePeriod}
              onChangeTempTimeOfDay={this.onChangeTempTimeOfDay}
              onSubmitUpdateFilters={this.onSubmitUpdateFilters}
              includeFilterLab={pathname === ''}
            />
          </Col>
          <Col md={4}>
            <CFMChart filteredData={filteredData} filters={filters}/>
          </Col> */}
      {/*
        <br/>
        <br/>
        {pathname === '' && filters.selectedLab === LAB_ROOM_FILTERS.all &&
          <Row>
            <Col md={2}>
            </Col>
            <Col md={9}>
              <CFMChangeBarGraph weekData={weekData}/>
            </Col>
          </Row>
        } */}
      </Container>
    );
  }
}

export default App;
