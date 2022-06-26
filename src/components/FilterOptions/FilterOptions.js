import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import {
  DATA_FORMATS,
  DATA_TYPES,
  GRAPH_TYPES,
  LAB_FUMEHOOD_MAPPING,
  LAB_NAME_FILTERS,
  RELATIVE_TIME_RANGES_OPTIONS,
  TIME_GRANULARITIES,
  TIME_OF_DAY,
} from '../../utils/Constants';
import {
  capitalizeString,
  fetchFilteredData,
  getOffsettedStartDate,
} from '../../utils/Utils';
import './FilterOptions.scss';

class FilterOptions extends React.Component {
  constructor() {
    super();
    this.state = {
      filters: {
        relativeTimeRange: RELATIVE_TIME_RANGES_OPTIONS.all.value,
        timeOfDay: TIME_OF_DAY.all,
      },
    };
  }

  onChangeRelativeTimeRange = (range) => {
    const { filters } = this.state;
    filters.relativeTimeRange = range;
    this.setState({ filters: { ...filters } });
  };

  onChangeTimeOfDay = (timeOfDay) => {
    const { filters } = this.state;
    filters.timeOfDay = timeOfDay;
    this.setState({ filteres: { ...filters } });
  };

  onSubmitUpdateFilters = async () => {
    const { filters } = this.state;
    const { lab, setFilteredLineGraphData } = this.props;

    const dataFormat =
      lab === LAB_NAME_FILTERS.all
        ? DATA_FORMATS.allLabs
        : DATA_FORMATS.singleLab;
    const startDate = getOffsettedStartDate(
      new Date(),
      filters.relativeTimeRange
    );
    const labFumehoodMapping =
      lab === LAB_NAME_FILTERS.all
        ? LAB_FUMEHOOD_MAPPING
        : { lab: LAB_FUMEHOOD_MAPPING[lab] };
    const filteredLineGraphData = await fetchFilteredData(
      DATA_TYPES.cfm,
      dataFormat,
      GRAPH_TYPES.line,
      TIME_GRANULARITIES.day,
      filters.timeOfDay,
      labFumehoodMapping,
      startDate
    );
    setFilteredLineGraphData(filteredLineGraphData.data);
  };

  render() {
    const { filters } = this.state;

    const timeOfDaysOptions = Object.values(TIME_OF_DAY).map((time) => {
      return {
        value: time,
        label: capitalizeString(time),
      };
    });

    return (
      <Container className='FilterOptions' fluid>
        <Row>
          Select a Time Period
          <Select
            options={Object.values(RELATIVE_TIME_RANGES_OPTIONS)}
            onChange={(options) =>
              this.onChangeRelativeTimeRange(options.value)
            }
            defaultValue={{
              value: filters.timeRange,
              label: RELATIVE_TIME_RANGES_OPTIONS.one_month.label,
            }}
          />
        </Row>
        <br />
        <Row>
          Select Time of Day Data
          <Select
            options={timeOfDaysOptions}
            onChange={(options) => this.onChangeTimeOfDay(options.value)}
            defaultValue={{
              value: filters.timeOfDay,
              label: capitalizeString(filters.timeOfDay),
            }}
          />
        </Row>
        <br />
        <Row>
          <Button onClick={this.onSubmitUpdateFilters}>Filter</Button>
        </Row>
      </Container>
    );
  }
}

export default FilterOptions;
