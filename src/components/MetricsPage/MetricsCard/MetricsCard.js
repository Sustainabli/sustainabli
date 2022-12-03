import React from 'react';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import { LAB_NAME_FILTERS, METRIC_TYPES_MAP } from '../../../utils/Constants';
import { convertDataToMetric, calculateMetricAvg } from '../../../utils/Utils';

import './MetricsCard.scss';
import LineGraph from '../../LineGraph/LineGraph';

class MetricsCard extends React.Component {
  constructor() {
    super();
    this.selectInputRef = React.createRef();
    this.state = {
      selectedNewMetric: '',
      shouldShowTimeSeries: false,
    };
  }

  onChangeSelectedNewMetric = value => {
    this.setState({ selectedNewMetric: value });
  };

  onClickAddNewMetric = () => {
    const { selectedNewMetric } = this.state;
    if (selectedNewMetric) {
      this.props.onAddNewMetric(selectedNewMetric);
      this.selectInputRef.current.clearValue();
    }
  };

  render() {
    const { shouldShowTimeSeries } = this.state;
    const { metricType, selectedMetrics, data } = this.props;
    const metricData = convertDataToMetric(metricType, data);
    const metricValue = calculateMetricAvg(metricData);
    const colMdVal = shouldShowTimeSeries ? 11 : 5;
    return (
      <Col className='MetricsCard' md={colMdVal}>
        {metricType.type === 'newMetric' ? (
          <React.Fragment>
            <Row className='metrics-title'>{metricType.title}</Row>
            <br />
            <Row>
              <Select
                className='filter-select'
                ref={this.selectInputRef}
                options={Object.values(METRIC_TYPES_MAP)
                  .filter(metric => !selectedMetrics.includes(metric.type))
                  .map(metric => ({
                    value: metric.type,
                    label: metric.title,
                  }))}
                onChange={options =>
                  this.onChangeSelectedNewMetric(options ? options.value : null)
                }
              />
            </Row>
            <Button onClick={this.onClickAddNewMetric} className='add-metrics-button'>Add Metric</Button>
          </React.Fragment>
        ) : shouldShowTimeSeries ? (
          <React.Fragment>
            <LineGraph
              lab={LAB_NAME_FILTERS.all}
              filteredData={metricData}
              chartTitle={metricType.title}
            />
            <Row className='timeseries-row'>
              <Col md='auto' />
              <Col md={2}>
                <BootstrapSwitchButton
                  checked={shouldShowTimeSeries}
                  onChange={checked =>
                    this.setState({ shouldShowTimeSeries: checked })
                  }
                />
              </Col>
              <Col className='timeseries-label'> Timeseries </Col>
            </Row>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Row className='metrics-title'>{metricType.title}</Row>
            <br />
            <Row className='metrics-data'>
              <h2>
                {metricValue} {metricType.unit}
              </h2>
            </Row>
            <br />
            {/* <div>{percentChange}% since last week</div> */}
            {metricType.type === 'airflow' && (
              <Row className='timeseries-row'>
                <Col md='auto' />
                <Col md={2}>
                  <BootstrapSwitchButton
                    checked={shouldShowTimeSeries}
                    onChange={checked =>
                      this.setState({ shouldShowTimeSeries: checked })
                    }
                  />
                </Col>
                <Col className='timeseries-label'> Timeseries </Col>
              </Row>
            )}
          </React.Fragment>
        )}
      </Col>
    );
  }
}

export default MetricsCard;
