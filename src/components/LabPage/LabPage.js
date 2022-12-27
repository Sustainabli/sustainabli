import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactLoading from 'react-loading';
import LineGraph from '../LineGraph/LineGraph.js';
import FilterOptions from '../FilterOptions/FilterOptions';
import ChartTemplate from '../ChartTemplate/ChartTemplate.js';

import {
  DATA_FORMATS,
  DATA_TYPES,
  GRAPH_TYPES,
  LAB_FUMEHOOD_MAPPING,
  LOADING_COLOR,
  RELATIVE_TIME_RANGES_OPTIONS,
  TIME_GRANULARITIES,
  TIME_OF_DAY,
} from '../../utils/Constants.js';
import {
  capitalizeString,
  fetchFilteredData,
  getOffsettedStartDate,
} from '../../utils/Utils.js';
import './LabPage.scss';

class LabPage extends React.Component {
  constructor() {
    super();
    this.state = {
      lineGraphData: {},
      barGraphData: {},
      loading: true,
    };
  }

  async componentDidMount() {
    const { lab } = this.props;

    const labFumehoodMapping = {};
    labFumehoodMapping[lab] = LAB_FUMEHOOD_MAPPING[lab];
    const startDate = getOffsettedStartDate(
      new Date(),
      RELATIVE_TIME_RANGES_OPTIONS.one_month.value
    );

    const response = await fetchFilteredData(
      DATA_TYPES.cfm,
      DATA_FORMATS.singleLab,
      GRAPH_TYPES.line,
      TIME_GRANULARITIES.day,
      TIME_OF_DAY.all,
      labFumehoodMapping,
      startDate
    );

    const responseBar = await fetchFilteredData(
      DATA_TYPES.cfm,
      DATA_FORMATS.singleLab,
      GRAPH_TYPES.line,
      TIME_GRANULARITIES.week,
      TIME_OF_DAY.all,
      labFumehoodMapping,
      startDate
    );

    this.setState({
      lineGraphData: response,
      barGraphData: responseBar,
      loading: false,
    });
  }

  setFilteredLineGraphData = (data) => {
    console.log("changing", data)
    this.setState({ lineGraphData: data });
  };

  setFilteredBarGraphData = (data) => {
    this.setState({ barGraphData: data });
  };

  render() {
    const { lab } = this.props;
    const { lineGraphData, barGraphData, loading } = this.state;

    const barChartTitle = `Fumehood CFM Data for ${capitalizeString(lab)} Lab (Bar)`;
    const chartTitle = `Fumehood CFM Data for ${capitalizeString(lab)} Lab`;

    return (
      <Container fluid className='LabPage'>
        {!loading ? (
          <React.Fragment>
            <h1>{capitalizeString(lab)} Lab</h1>
            <br />
            <Row>
              <Col md={2}>
                <FilterOptions
                  lab={lab}
                  setFilteredLineGraphData={this.setFilteredBarGraphData}
                />
              </Col>
              <Col md={10}>
                {Object.keys(barGraphData).length > 0 && (
                  <ChartTemplate
                    lab={lab}
                    filteredData={barGraphData}
                    chartTitle={barChartTitle}
                    chartType={"bar"}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col md={2}>
                <FilterOptions
                  lab={lab}
                  setFilteredLineGraphData={this.setFilteredLineGraphData}
                />
              </Col>
              <Col md={10}>
                {Object.keys(lineGraphData).length > 0 && (
                  <ChartTemplate
                    lab={lab}
                    filteredData={lineGraphData}
                    chartTitle={chartTitle}
                    chartType={"line"}
                  />
                )}
              </Col>
            </Row>
          </React.Fragment>
        ) : (
          <ReactLoading
            type='spin'
            color={LOADING_COLOR}
            className='react-loading'
          />
        )}
      </Container>
    );
  }
}

export default LabPage;
