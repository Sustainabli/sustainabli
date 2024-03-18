import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import FumeTable from '../../utils/components/FumeTable/FumeTable';
import MetricsLineGraph from '../../utils/components/MetricsLineGraph/MetricsLineGraph';
import Header from '../../utils/components/Header/Header';
import {
  // Account roles
  ORGANIZATION_ADMIN_ROLE,

  // Form filter options
  RELATIVE_TIME_RANGES_OPTIONS,
  TIME_GRANULARITIES,
} from '../../utils/Constants';
import { fetchSensorData, getOffsettedStartDate } from '../../utils/Utils';

import './DataQueryPage.scss';

// TODO instead of using relativeTimeRange, create a calendar selector component for startDate and endDate. We can also maybe tailor this to be a startTime and endTime hh:mm yy:mm:dd
// TODO refactor this page with recoil
// TODO make Data Query Page a functional component and use useRecoilState
class DataQueryPage extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
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
    const { relativeTimeRange, selectedSensors } = this.state;
    const startDate = getOffsettedStartDate(new Date(), relativeTimeRange);
    // TODO modify dates to only use days, instead of time since we can lose data depending on the hour of the day requested

    this.setState({
      data: await fetchSensorData(TIME_GRANULARITIES.day, startDate, new Date(), selectedSensors),
      queriedSensors: [...selectedSensors],
    });
  };

  render() {
    const { data, queriedSensors, relativeTimeRange } = this.state;
    const { availableSensors, userInfo } = this.props;
    const sensorOptions = availableSensors.map(sensor => ({
      value: sensor.sensor_id,
      label: sensor.fume_hood_name
    }));
    return (
      <Container className='DataQueryPage' fluid>
        <Header pageName='Metrics Page' />
        { userInfo && userInfo.organization_code && (userInfo.group_name || (userInfo.role === ORGANIZATION_ADMIN_ROLE)) ?
            <React.Fragment>
              <Row className='filter-row'>
                <Col className='filter-col' md={3}>
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
                <Col className='filter-col' md={8}>
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
                    variant='dark'
                    className='query-metrics-button'
                    onClick={this.fetchData}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
              {queriedSensors.length > 0  && Object.keys(data).length > 0 ?
                <Row className='metrics-row'>
                  <MetricsLineGraph data={data}/>
                  <FumeTable data={data}/>
                </Row>
                :
                <Row>No data to show </Row>
              }
            </React.Fragment>
          :
            <Row>
              Please contact your organization admin to add you to an organization and a group. You will not be able to view data until you are a part of an organization and a group.
            </Row>
        }
      </Container>
    );
  }
}

export default DataQueryPage;
