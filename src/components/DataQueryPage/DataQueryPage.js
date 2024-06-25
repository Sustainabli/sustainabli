// Page that users can use to query for data. Users can
//    - Query for a start and end date
//    - Select fume hoods to query from. 
//        - For USER role, they can only query from fume hoods in their group/lab
//        - For ORGANIZATION_ADMIN role, they can query from all fume hoods belonging to their organiation

import { useState } from 'react';
import { useRecoilValue } from "recoil";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import FumeTable from '../../utils/components/FumeTable/FumeTable';
import MetricsLineGraph from '../../utils/components/MetricsLineGraph/MetricsLineGraph';
import Header from '../../utils/components/Header/Header';
import { TIME_GRANULARITIES } from '../../utils/Constants';
import { availableSensorInfoSelector } from '../../utils/Recoil';
import { fetchSensorData } from '../../utils/Requests';
import { formatDateQueryDate } from '../../utils/Utils';

import './DataQueryPage.scss';

function DataQueryPage() {
  const availableSensors = useRecoilValue(availableSensorInfoSelector);

  // Default start date to the current day but 00:00 HH:MM
  // TODO need to configure front end to use local time zone but backend stores UTC so probably in the node layer we need to convert local to UTC and vice versa
  const startDate = new Date();
  startDate.setHours(0);
  startDate.setMinutes(0);
  const [queryStartDate, setQueryStartDate] = useState(formatDateQueryDate(startDate));

  const [data, setData] = useState([]);
  const [queryEndDate, setQueryEndDate] = useState(formatDateQueryDate(new Date()));
  const [selectedSensors, setSelectedSensors] = useState([]);

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
  };

  const sensorOptions = availableSensors.map(sensor => ({
    value: sensor.sensor_id,
    label: sensor.fume_hood_name
  }));

  // TODO: format data query page better
  return (
    <Container className='DataQueryPage' fluid>
      <Header pageName='Data Query Page' />
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
          onClick={fetchData}
        >
          Submit
        </Button>
      </Col>
      {Object.keys(data).length > 0 ?
        <Row className='metrics-row'>
          <MetricsLineGraph data={data} />
          <FumeTable data={data} isGroup={false} />
        </Row>
        :
        <Row>No data to show </Row>
      }
    </Container>
  );
}

export default DataQueryPage;
