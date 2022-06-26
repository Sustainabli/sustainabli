import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rankings from '../Rankings/Rankings';
import CFMBarGraph from '../../CFMBarGraph/CFMBarGraph';
import CFMLineGraph from '../../CFMLineGraph/CFMLineGraph';
import CompetitionStats from '../../CompetitionStats/CompetitionStats';
import FilterOptions from '../../FilterOptions/FilterOptions';
import { LAB_NAME_FILTERS, LAB_NAME_LABELS } from '../../../utils/Constants';

class Dashboard extends React.Component {
  render() {
    const { barGraphData, lineGraphData, setFilteredLineGraphData } =
      this.props;
    return (
      <React.Fragment>
        <Row className='homepage-row'>
          <Col md={5}>
            {Object.keys(barGraphData).length > 0 && (
              <CompetitionStats barGraphData={barGraphData} />
            )}
          </Col>
          <Col md={7}>
            {Object.keys(barGraphData).length > 0 && (
              <CFMBarGraph
                barGraphData={barGraphData}
                barGraphLabels={LAB_NAME_LABELS}
              />
            )}
          </Col>
        </Row>
        <br />
        <Row className='homepage-row'>
          <Col md={2}>
            <FilterOptions
              lab={LAB_NAME_FILTERS.all}
              setFilteredLineGraphData={setFilteredLineGraphData}
            />
          </Col>
          <Col md={7}>
            {Object.keys(lineGraphData).length > 0 && (
              <CFMLineGraph
                lab={LAB_NAME_FILTERS.all}
                filteredData={lineGraphData}
                chartTitle='Average CFM per Lab'
              />
            )}
          </Col>
          <Col md={3}>
            {Object.keys(barGraphData).length > 0 && (
              <Rankings
                barGraphData={barGraphData}
                barGraphLabels={LAB_NAME_LABELS}
              />
            )}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Dashboard;
