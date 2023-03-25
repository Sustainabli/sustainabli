import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap'
import ReactLoading from 'react-loading';
import LineGraph from '../LineGraph/LineGraph.js';
import FilterOptions from '../FilterOptions/FilterOptions';
import ChartTemplate from '../ChartTemplate/ChartTemplate.js';
import MetricsAreaChart from "../MetricsAreaChart/MetricsAreaChart.js";
import CostAreaChart from '../CostAreaChart/CostAreaChart.js';
import FumeTable from '../FumeTable/FumeTable.js';
import SashStackChart from '../SashStackChart/SashStackChart.js';


import {
  DATA_FORMATS,
  DATA_TYPES,
  GRAPH_TYPES,
  LAB_FUMEHOOD_MAPPING,
  LOADING_COLOR,
  RELATIVE_TIME_RANGES_OPTIONS,
  TIME_GRANULARITIES,
  TIME_OF_DAY,
  LAB_NAMES,
} from '../../utils/Constants.js';
import {
  capitalizeString,
  fetchFilteredData,
  getOffsettedStartDate,
  formatDateLabel,
} from '../../utils/Utils.js';
import './LabPage.scss';

import HeatMap from "react-heatmap-grid";


class LabPage extends React.Component {
  constructor() {
    super();
    this.state = {
      lineGraphData: {},
      barGraphData: {},
      areaGraph: {},
      costAreaGraph: {},
      tableData: {},
      allTableData: {},
      loading: true,
    };
  }

  async componentDidMount() {
    const { lab } = this.props;

    const labFumehoodMapping = {};
    labFumehoodMapping[lab] = LAB_FUMEHOOD_MAPPING[lab];
    const startDate = getOffsettedStartDate(
      new Date(),
      RELATIVE_TIME_RANGES_OPTIONS.all.value
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

    const test = await fetchFilteredData(
      DATA_TYPES.cfm,
      DATA_FORMATS.allLabs,
      GRAPH_TYPES.line,
      TIME_GRANULARITIES.day,
      TIME_OF_DAY.all,
      labFumehoodMapping,
      startDate
    );

    const test2 = await fetchFilteredData(
      DATA_TYPES.cfm,
      DATA_FORMATS.allLabs,
      GRAPH_TYPES.line,
      TIME_GRANULARITIES.day,
      TIME_OF_DAY.all,
      labFumehoodMapping,
      startDate
    );


    const test3 = await fetchFilteredData(
      DATA_TYPES.cfm,
      DATA_FORMATS.singleLab,
      GRAPH_TYPES.line,
      TIME_GRANULARITIES.year,
      TIME_OF_DAY.all,
      labFumehoodMapping,
      startDate
    );

    const test4 = await fetchFilteredData(
      DATA_TYPES.cfm,
      DATA_FORMATS.allLabs,
      GRAPH_TYPES.line,
      TIME_GRANULARITIES.year,
      TIME_OF_DAY.all,
      LAB_FUMEHOOD_MAPPING,
      startDate
    );

    this.setState({
      lineGraphData: response,
      barGraphData: responseBar,
      areaGraph: test,
      costAreaGraph: test2,
      tableData: test3,
      allTableData: test4,
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
    const { lineGraphData, barGraphData, areaGraph, costAreaGraph, loading, tableData, allTableData } = this.state;

    const barChartTitle = `Fumehood CFM Data for ${capitalizeString(lab)} Lab (Bar)`;
    const chartTitle = `Fumehood CFM Data for ${capitalizeString(lab)} Lab`;

    const fumeHoods = LAB_FUMEHOOD_MAPPING[lab];

    return (
      <Container fluid className='LabPage'>
        {!loading ? (
          <React.Fragment>
            <h1>{capitalizeString(lab)} Lab</h1>
            <br />

            <Row>
              <Col md={6}>
                <Row>
                  <div>
                    {/* <HeatMap xLabels={heatMapData.x} yLabels={heatMapData.y} data={heatMapData.data} /> */}
                    <MetricsAreaChart data={areaGraph} />
                  </div>
                </Row>
                <Row>
                  <div>
                    {/* <HeatMap xLabels={heatMapData.x} yLabels={heatMapData.y} data={heatMapData.data} /> */}
                    <FumeTable data={allTableData} name={"Lab"} />
                  </div>
                </Row>
                <Row>
                  <div>
                    {/* <HeatMap xLabels={heatMapData.x} yLabels={heatMapData.y} data={heatMapData.data} /> */}
                    <CostAreaChart data={costAreaGraph} />
                  </div>
                </Row>
              </Col>
              <Col md={6}>
                <Row>
                  <div>
                    <SashStackChart />
                  </div>
                </Row>
                <Row>
                  <div>
                    <FumeTable data={tableData} name={"Fume Hood"} />
                  </div>
                </Row>
                <Row>
                  <div>
                    {/* <HeatMap xLabels={heatMapData.x} yLabels={heatMapData.y} data={heatMapData.data} /> */}
                    {/* <CostAreaChart data={costAreaGraph} /> */}
                  </div>
                </Row>
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
