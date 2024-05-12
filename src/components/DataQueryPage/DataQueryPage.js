import React, { useEffect, useState } from 'react';
import { useRecoilState } from "recoil";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import FumeTable from '../../utils/components/FumeTable/FumeTable';
import MetricsLineGraph from '../../utils/components/MetricsLineGraph/MetricsLineGraph';
import Header from '../../utils/components/Header/Header';
import {
  // Account roles
  ORGANIZATION_ADMIN_ROLE,

  // Recoil states
  USER_INFO_STATE,
  AVAILABLE_SENSORS_STATE,

  // Form filter options
  TIME_GRANULARITIES,
} from '../../utils/Constants';
import { fetchSensorData, getOffsettedStartDate, formatDateQueryDate } from '../../utils/Utils';

import './DataQueryPage.scss';

// TODO refactor this page with recoil
// TODO make Data Query Page a functional component and use useRecoilState
function DataQueryPage() {
  const [userInfo] = useRecoilState(USER_INFO_STATE);
  const [availableSensors] = useRecoilState(AVAILABLE_SENSORS_STATE);

  // Start date of current day but 00:00 HH:MM
  // TODO need to configure front end to use local time zone but backend stores UTC so probably in the node layer we need to convert local to UTC and vice versa
  const startDate = new Date();
  startDate.setHours(0);
  startDate.setMinutes(0);

  const [data, setData] = useState([]);
  const [queryStartDate, setQueryStartDate] = useState(formatDateQueryDate(startDate));
  const [queryEndDate, setQueryEndDate] = useState(formatDateQueryDate(new Date()));
  const [queriedSensors, setQueriedSensors] = useState([]); // Updates when clicking submit button
  const [selectedSensors, setSelectedSensors] = useState([]); // Updates when selecting labs from drop down

  const onChangeSelectedSensorsFilter = options => {
    setSelectedSensors(options.map(option => option.value));
  };

  const onChangeStartDate = event => {
    setQueryStartDate(event.target.value);
  }

  const onChangeEndDate = event => {
    setQueryEndDate(event.target.value);
  }

  const fetchData = async () => {
    const newSensorData = await fetchSensorData(TIME_GRANULARITIES.day, queryStartDate, queryEndDate, selectedSensors);
    setData(newSensorData);
    setQueriedSensors([...selectedSensors]);
  };

  const sensorOptions = availableSensors.map(sensor => ({
    value: sensor.sensor_id,
    label: sensor.fume_hood_name
  }));

  return (
    <Container className='DataQueryPage' fluid>
      <Header pageName='Metrics Page' />
      { userInfo && userInfo.organization_code && (userInfo.group_name || (userInfo.role === ORGANIZATION_ADMIN_ROLE)) ?
        <React.Fragment>
          <Row className='filter-date-row'>
            <Col className='filter-date-col' md={6}>
              <Form>
                <Form.Group controlId='startDateGroup' />
                <Form.Label> Start Date </Form.Label>
                <Form.Control
                  type="datetime-local"
                  id="start-date"
                  value={formatDateQueryDate(queryStartDate)}
                  onChange={onChangeStartDate}
                />
              </Form>
            </Col>
            <Col className='filter-date-col' md={6}>
              <Form>
                <Form.Group controlId='endDateGroup' />
                <Form.Label> End Date </Form.Label>
                <Form.Control
                  type="datetime-local"
                  id="end-date"
                  value={formatDateQueryDate(queryEndDate)}
                  onChange={onChangeEndDate}
                />
              </Form>
            </Col>
          </Row>
          <Row className='filter-fume-hoods-row'>
            <Col className='filter-fume-hoods-col' md={12}>
              Fume Hoods:
              <Select
                className='filter-select'
                isMulti={true}
                closeMenuOnSelect={false}
                options={sensorOptions}
                onChange={options => onChangeSelectedSensorsFilter(options)}
              />
            </Col>
          </Row>
          <Col className='filter-col' md={1}>
            <Button
              variant='dark'
              className='query-metrics-button'
              onClick={this.fetchData}
            >
              Submit
            </Button>
          </Col>
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

export default DataQueryPage;
