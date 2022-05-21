import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Select from 'react-select'

import {
  LAB_NAMES,
  // RELATIVE_TIME_RANGES,
  TIME_GRANULARITIES,
  TIME_OF_DAY,
} from '../../utils/Constants';

import {
  capitalizeString,
} from '../../utils/Utils';

class FilterOptions extends React.Component {

  render() {
    const {
      onChangeTempSelectedLab,
      onChangeTempGranularity,
      // onChangeTempTimePeriod,
      onChangeTempTimeOfDay,
      onSubmitUpdateFilters,
      includeFilterLab,
    } = this.props;

    const labs = Object.keys(LAB_NAMES).map(lab => {
      return {
        value: LAB_NAMES[lab],
        label: `${capitalizeString(LAB_NAMES[lab])} ${lab === LAB_NAMES.all ? 'Labs' : 'Lab'}`,
      };
    });

    const granuliarities = Object.values(TIME_GRANULARITIES).map(granularity => {
      return { value: granularity, label: capitalizeString(granularity) }
    });

    // const timePeriods = Object.values(RELATIVE_TIME_RANGES).map(period => {
    //   return {
    //     value: period,
    //     label: `Last ${period}`
    //   }
    // });

    const timeOfDays = Object.values(TIME_OF_DAY).map(time => {
      return {
        value: time,
        label: capitalizeString(time),
      };
    });

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
          <Select options={granuliarities} onChange={options => onChangeTempGranularity(options.value)} defaultValue={{value: TIME_GRANULARITIES.day, label: capitalizeString(TIME_GRANULARITIES.day)}}/>
        </Row>
        {/*
        <Row>
          Select a Time Period
          <Select options={timePeriods} onChange={options => onChangeTempTimePeriod(options.value)}/>
        </Row>
          */}
        <Row>
          Select Time of Day Data
          <Select options={timeOfDays} onChange={options => onChangeTempTimeOfDay(options.value)} defaultValue={{value: TIME_OF_DAY.all, label: capitalizeString(TIME_OF_DAY.all)}}/>
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
