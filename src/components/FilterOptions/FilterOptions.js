import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Select from 'react-select'
import {
  CHART_TYPES,
  RELATIVE_TIME_RANGES,
  TIME_GRANULARITIES,
  TIME_OF_DAY,
} from '../../utils/Constants';
import {
  capitalizeString,
  fetchFilteredData,
} from '../../utils/Utils';
import './FilterOptions.scss';

class FilterOptions extends React.Component {
  constructor() {
    super();
    this.state = {
      filters: {
        timeRange: RELATIVE_TIME_RANGES.one_month.value,
        timeOfDay: TIME_OF_DAY.all,
      },
    }
  }

  onChangeTimeRange = range => {
    const { filters } = this.state;
    filters.timeRange = range;
    this.setState({ filters: { ...filters } });
  }

  onChangeTimeOfDay = timeOfDay => {
    const { filters } = this.state;
    filters.timeOfDay = timeOfDay;
    this.setState({ filteres: { ...filters } });
  }

  onSubmitUpdateFilters = async () => {
    const { filters } = this.state;
    const { setFilteredLineGraphData } = this.props;
    const filteredLineGraphData = (await fetchFilteredData(TIME_GRANULARITIES.day, filters, CHART_TYPES.cfm));
    setFilteredLineGraphData(filteredLineGraphData.data);
  }

  render() {
    const { filters } = this.state;

    const timeRangeOptions = Object.values(RELATIVE_TIME_RANGES).map(range => {
      return {
        value: range.value,
        label: range.label,
      }
    });

    const timeOfDaysOptions = Object.values(TIME_OF_DAY).map(time => {
      return {
        value: time,
        label: capitalizeString(time),
      };
    });

    return (
      <Container className="FilterOptions" fluid>
        <Row>
          Select a Time Period
          <Select options={timeRangeOptions} onChange={options => this.onChangeTimeRange(options.value)} defaultValue={{value: filters.timeRange, label: RELATIVE_TIME_RANGES.one_month.label}}/>
        </Row>
        <br/>
        <Row>
          Select Time of Day Data
          <Select options={timeOfDaysOptions} onChange={options => this.onChangeTimeOfDay(options.value)} defaultValue={{value: filters.timeOfDay, label: capitalizeString(filters.timeOfDay)}}/>
        </Row>
        <br/>
        <Row>
          <Button onClick={this.onSubmitUpdateFilters}>Filter</Button>
        </Row>
      </Container>
    );
  }
}

export default FilterOptions;
