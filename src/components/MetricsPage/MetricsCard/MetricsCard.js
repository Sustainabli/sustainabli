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
      <Col className='metrics-card' md={colMdVal}>
        <Container fluid className='MetricsCard'>
          {metricType.type === 'newMetric' ? (
            <React.Fragment>
              <Row>{metricType.title}</Row>
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
                    this.onChangeSelectedNewMetric(
                      options ? options.value : null
                    )
                  }
                />
              </Row>
              <Button onClick={this.onClickAddNewMetric}>Add Metric</Button>
            </React.Fragment>
          ) : shouldShowTimeSeries ? (
            <React.Fragment>
              <LineGraph
                lab={LAB_NAME_FILTERS.all}
                filteredData={metricData}
                chartTitle={metricType.title}
              />
              <BootstrapSwitchButton
                checked={shouldShowTimeSeries}
                onChange={checked =>
                  this.setState({ shouldShowTimeSeries: checked })
                }
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Row>{metricType.title}</Row>
              <br />
              <h4>
                {metricValue} {metricType.unit}
              </h4>
              <br />
              {/* <div>{percentChange}% since last week</div> */}
              {metricType.type === 'airflow' && (
                <BootstrapSwitchButton
                  checked={shouldShowTimeSeries}
                  onChange={checked =>
                    this.setState({ shouldShowTimeSeries: checked })
                  }
                />
              )}
            </React.Fragment>
          )}
        </Container>
      </Col>
    );
  }
}

export default MetricsCard;
