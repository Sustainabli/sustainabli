import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import FumeTable from './components/FumeTable/FumeTable.js';
import MetricsLineGraph from './components/MetricsLineGraph/MetricsLineGraph';
import Header from '../Header/Header';
import {
  RELATIVE_TIME_RANGES_OPTIONS,
  TIME_GRANULARITIES,
} from '../../utils/Constants';
import { fetchSensorData, getOffsettedStartDate } from '../../utils/Utils';
import './MetricsPage.scss';

// TODO instead of using relativeTimeRange, create a calendar selector component for startDate and endDate. We can also maybe tailor this to be a startTime and endTime hh:mm yy:mm:dd
class MetricsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {},
      relativeTimeRange: RELATIVE_TIME_RANGES_OPTIONS.one_month.value,
      queriedSensors: [],   // Updates when clicking submit button
      selectedSensors: [],  // Updates when selecting labs from drop down
    };
  }

  onChangeRelativeTimeRange = range => {
    this.setState({ relativeTimeRange: range });
  };

  onChangeSelectedSensorsFilter = options => {
    this.setState({ selectedSensors: options.map(option => option.value) });
  };

  fetchData = async () => {
    const { selectedSensors, relativeTimeRange } = this.state;
    const startDate = getOffsettedStartDate(new Date(), relativeTimeRange);
    // TODO modify dates to only use days, instead of time since we can lose data depending on the hour of the day requested
    const reqBody = {
      granularity: TIME_GRANULARITIES.day,
      start_date: startDate,
      end_date: new Date(),
      sensors: selectedSensors,
    }

    this.setState({
      data: await fetchSensorData(reqBody),
      queriedSensors: [...selectedSensors],
    });
  };

  render() {
    const { data, queriedSensors, relativeTimeRange } = this.state;
    const { availableSensors } = this.props;
    const sensorOptions = availableSensors.map(sensor => ({
      value: sensor.id,
      label: sensor.fumeHoodName
    }));
    return (
      <Container className='MetricsPage' fluid>
        <Header pageName='Metrics Page' />
        <Row className='filter-row'>
          <Col className='filter-col' md={5}>
            Date Range:
            <Select
              className='filter-select'
              options={Object.values(RELATIVE_TIME_RANGES_OPTIONS)}
              onChange={options =>
                this.onChangeRelativeTimeRange(options.value)
              }
              defaultValue={{
                label: RELATIVE_TIME_RANGES_OPTIONS.one_month.label,
                value: relativeTimeRange,
              }}
            />
          </Col>
          <Col className='filter-col' md={6}>
            Fume Hoods:
            <Select
              className='filter-select'
              isMulti={true}
              closeMenuOnSelect={false}
              options={sensorOptions}
              onChange={options => this.onChangeSelectedSensorsFilter(options)}
            />
          </Col>
          <Col className='filter-col' md={1}>
            <Button
              className='query-metrics-button'
              onClick={this.fetchData}
            >
              Submit
            </Button>
          </Col>
        </Row>
        <br />
        <br />
        {(queriedSensors.length > 0  && data) ? (
          <Row className='metrics-row'>
            <MetricsLineGraph data={data}/>
            <FumeTable data={data}/>
          </Row>
        ) : (
          <Row> Select a Fume Hood </Row>
        )}
      </Container>
    );
  }
}

export default MetricsPage;
