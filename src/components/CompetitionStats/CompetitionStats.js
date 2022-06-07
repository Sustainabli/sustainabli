import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StatCard from './StatCard/StatCard';
import './CompetitionStats.scss';

class CompetitionStats extends React.Component {
  render() {
    const { barGraphData } = this.props;
    const weekKeys = Object.keys(barGraphData);
    const currWeekKey = weekKeys[weekKeys.length - 1];
    const lastWeekKey = weekKeys[weekKeys.length - 2];

    const lastAvgCFM = (barGraphData[lastWeekKey].reduce((acc, curr) => acc + Number(curr), 0) / 4).toFixed(2);
    const currAvgCFM = (barGraphData[currWeekKey].reduce((acc, curr) => acc + Number(curr), 0) / 4).toFixed(2);
    const percentAvgCFMChange = (100 * (currAvgCFM - lastAvgCFM) / lastAvgCFM).toFixed(2);

    const currEnergySaved = (currAvgCFM * 357.1 / 52).toFixed(2);
    const lastEnergySaved = (lastAvgCFM * 357.1 / 52).toFixed(2);
    const percentEnergySavedChange = (100 * (currEnergySaved - lastEnergySaved) / lastEnergySaved).toFixed(2);


    return (
      <Container fluid className="CompetitionStats">
        <Row>
          <Col md={6}>
            <StatCard title="Energy Saved" stat={`${currEnergySaved} kWh`} percentChange={percentEnergySavedChange}/>
          </Col>
          <Col md={6}>
            <StatCard title="Average Airflow" stat={`${currAvgCFM} CFM`} percentChange={percentAvgCFMChange}/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CompetitionStats;
