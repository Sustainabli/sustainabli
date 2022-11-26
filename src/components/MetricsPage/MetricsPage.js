import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import MetricsCard from './MetricsCard/MetricsCard';
import {
  DATA_FORMATS,
  DATA_TYPES,
  GRAPH_TYPES,
  LAB_FILTER_OPTIONS,
  LAB_FUMEHOOD_MAPPING,
  METRIC_TYPES_MAP,
  METRIC_TYPES_NEW_METRIC,
  RELATIVE_TIME_RANGES_OPTIONS,
  TIME_GRANULARITIES,
  TIME_OF_DAY,
} from '../../utils/Constants';
import { fetchFilteredData, getOffsettedStartDate } from '../../utils/Utils';

import './MetricsPage.scss';

class MetricsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      relativeTimeRange: RELATIVE_TIME_RANGES_OPTIONS.all.value,
      // Updates when clicking submit button
      queriedLabs: [],
      // Updates when selecting labs from drop down
      selectedLabs: [],
      selectedMetrics: [],
      data: {},
    };
  }

  onAddNewMetric = metricType => {
    const { selectedMetrics } = this.state;
    selectedMetrics.push(metricType);
    this.setState({ selectedMetrics: [...selectedMetrics] });
  };

  onChangeRelativeTimeRange = range => {
    this.setState({ relativeTimeRange: range });
  };

  onChangeLabFilter = options => {
    this.setState({ selectedLabs: options.map(option => option.value) });
  };

  onChangeSelectedMetrics = (metricName, toAdd) => {
    const { selectedMetrics } = this.state;
    if (toAdd) {
      selectedMetrics.push(metricName);
      this.setState({ selectedMetrics: [...selectedMetrics] });
    } else {
      const newlySelectedMetrics = selectedMetrics.selectedMetrics.filter(
        metric => metric !== metricName
      );
      this.setState({ selectedMetrics: newlySelectedMetrics });
    }
  };

  fetchData = async () => {
    const { selectedLabs, relativeTimeRange } = this.state;
    const labFumehoodMapping = {};
    selectedLabs.forEach(
      lab => (labFumehoodMapping[lab] = LAB_FUMEHOOD_MAPPING[lab])
    );
    const startDate = getOffsettedStartDate(new Date(), relativeTimeRange);
    this.setState({
      queriedLabs: [...selectedLabs],
      data: await fetchFilteredData(
        DATA_TYPES.cfm,
        DATA_FORMATS.allLabs,
        GRAPH_TYPES.line,
        TIME_GRANULARITIES.day,
        TIME_OF_DAY.all,
        labFumehoodMapping,
        startDate
      ),
    });
  };

  render() {
    const { timeRange, selectedMetrics, queriedLabs, data } = this.state;
    return (
      <Container fluid className='MetricsPage'>
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
                value: timeRange,
                label: RELATIVE_TIME_RANGES_OPTIONS.one_month.label,
              }}
            />
          </Col>
          <Col className='filter-col' md={6}>
            Labs:
            <Select
              className='filter-select'
              isMulti={true}
              closeMenuOnSelect={false}
              options={LAB_FILTER_OPTIONS}
              onChange={options => this.onChangeLabFilter(options)}
            />
          </Col>
          <Col className='filter-col' md={1}>
            <Button className='query-metrics-button' onClick={this.fetchData}>
              Submit
            </Button>
          </Col>
        </Row>
        <br />
        <br />
        {queriedLabs.length > 0 ? (
          <Row className='metrics-row'>
            {data &&
              selectedMetrics.map(selectedMetric => (
                <React.Fragment key={selectedMetric}>
                  <MetricsCard
                    data={data}
                    metricType={METRIC_TYPES_MAP[selectedMetric]}
                    selectedMetrics={selectedMetrics}
                  />
                  <Col md={1} />
                </React.Fragment>
              ))}
            {Object.keys(METRIC_TYPES_MAP).length != selectedMetrics.length && (
              <MetricsCard
                data={data}
                metricType={METRIC_TYPES_NEW_METRIC}
                selectedMetrics={selectedMetrics}
                onAddNewMetric={this.onAddNewMetric}
              />
            )}
          </Row>
        ) : (
          <Row> Select a Lab </Row>
        )}
      </Container>
    );
  }
}

export default MetricsPage;
