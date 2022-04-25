import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Select from 'react-select'

import { TIME_GRANULARITIES, RELATIVE_TIME_RANGES } from '../../utils/Constants';

class FilterOptions extends React.Component {

  render() {
    const {
      onChangeTempSelectedLab,
      onChangeTempGranularity,
      onChangeTempTimePeriod,
      onChangeTempTimeOfDay,
      onSubmitUpdateFilters,
      includeFilterLab,
    } = this.props;

    const labs = [
      { value: 'all', label: "All Labs" },
      { value: 'issacs', label: 'Issacs Lab' },
      { value: 'rodriguez', label: 'Rodriguez Lab' },
      { value: 'falvey', label: 'Falvey Lab' },
      { value: 'wang', label: 'Wang Lab' },
    ];

    const granuliarities = TIME_GRANULARITIES.map(granularity => {
      return { value: granularity, label: granularity }
    });

    const timePeriods = RELATIVE_TIME_RANGES.map(period => {
      return {
        value: period,
        label: `Last ${period}`
      }
    });

    const timeOfDays = [
      {value: 'day', label: 'Day'},
      {value: 'night', label: 'Night'},
      {value: 'all', label: 'All'}
    ];

    return (
      <Container className="FilterOptions">
        {includeFilterLab &&
          <Row>
            Select Individual Lab Data
            <Select options={labs} onChange={options => onChangeTempSelectedLab(options.value)} defaultValue={labs[0]}/>
          </Row>
        }
        <Row>
          Select a Granularity
          <Select options={granuliarities} onChange={options => onChangeTempGranularity(options.value)} defaultValue={{value: 'day', label: 'day'}}/>
        </Row>
        {/*
        <Row>
          Select a Time Period
          <Select options={timePeriods} onChange={options => onChangeTempTimePeriod(options.value)}/>
        </Row>
          */}
        <Row>
          Select Time of Day Data
          <Select options={timeOfDays} onChange={options => onChangeTempTimeOfDay(options.value)} defaultValue={{value: 'all', label: 'All'}}/>
        </Row>
        <br/>
        <Row>
          <Button onClick={onSubmitUpdateFilters}>Filter</Button>
        </Row>
      </Container>
    );
  }
}

export default FilterOptions;
