import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import FillerOptions from './components/FilterOptions/FilterOptions';
import CFMChart from './components/CFMChart/CFMChart';
import SashChart from './components/SashChart/SashChart';
import {
  DAY,
  ALL,
  CFM,
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
        selectedLab: "all",
        granularity: DAY,
        timePeriod: ALL,
        timeOfDay: "all",
      },
      // These are the filters the user has SELECTED but hasn't SUBMITTED on the filter modal
      tempFilters: {
        selectedLab: "all",
        granularity: DAY,
        timePeriod: ALL,
        timeOfDay: "all",
      },
      filteredData: [],
      pathname: "",
    }
  }

  async componentDidMount() {
    const { filters } = this.state;
    let pathname = "";
    switch(window.location.pathname) {
      case "/issacs":
        pathname = "issacs";
        break;
      case "/rodriguez":
        pathname = "rodriguez";
        break;
      case "/falvey":
        pathname = "falvey";
        break;
      case "/wang":
        pathname = "wang";
        break;
      default:
        pathname = "";
    }
    if (pathname) {
      filters.selectedLab = pathname;
    }
    console.log(filters);
    // Might need to update filter state as well in the case where we isolate a specific lab url
    this.setState({ filteredData: await fetchFilteredData(filters, CFM), pathname: pathname, filters: filters, tempFilters: filters })
  }

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
      filteredData: await fetchFilteredData(tempFilters, CFM)
    });
  }

  render() {
    const { filters, filteredData, pathname } = this.state;

    return (
      <Container className="App" fluid>
        <Row>
          {/*<SashChart />*/}
          <Col md={2}>
            <FillerOptions
              onChangeTempSelectedLab={this.onChangeTempSelectedLab}
              onChangeTempGranularity={this.onChangeTempGranularity}
              onChangeTempTimePeriod={this.onChangeTempTimePeriod}
              onChangeTempTimeOfDay={this.onChangeTempTimeOfDay}
              onSubmitUpdateFilters={this.onSubmitUpdateFilters}
              includeFilterLab={pathname === ""}
            />
          </Col>
          <Col md={9}>
            <CFMChart filteredData={filteredData} filters={filters}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
