import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Modal from 'react-bootstrap/Modal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Toggle from 'react-toggle';
import "react-toggle/style.css";

import {
  CHART_COLORS,
  NONE,
  TIME_GRANULARITIES,
  ALL,
  RELATIVE_TIME_RANGES,
  SASH,
  CFM,
} from '../../utils/Constants.js';
import {
  fetchFilteredData,
  formatDateLabel,
  convertCFMToSash,
  generateChartOptions
} from '../../utils/Utils.js';

import './SashChart.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
);

class SashChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showFilterModal: false,
      filters: {
        granularity: NONE,
        showDayData: true,
        relativeTimeRange: ALL,
      },
      // These are the filters the user has SELECTED but hasn't SUBMITTED on the filter modal
      tempFilters: {
        granularity: NONE,
        showDayData: true,
        relativeTimeRange: ALL,
      },
      filteredData: [],
    };
  }

  async componentDidMount() {
    const { filters } = this.state;
    this.setState({ filteredData: await fetchFilteredData(filters, CFM) })
  }

  onShowFilterModal = () => {
    this.setState({ showFilterModal: true })
  }

  onHideFilterModal = () => {
    const { filters } = this.state;
    this.setState({ tempFilters: { ...filters }, showFilterModal: false })
  }

  // This fxn only updates tempFilters
  onChangeTimeRange = range => {
    const { tempFilters } = this.state;
    tempFilters.relativeTimeRange = range;
    this.setState({ tempFilters: { ...tempFilters } });
  }

  // This fxn only updates tempFilters
  onChangeTempGranularity = granularity => {
    const { tempFilters } = this.state;
    tempFilters.granularity = granularity;
    this.setState({ tempFilters: { ...tempFilters } });
  }

  // This fxn only updates tempFilters
  onChangeTempShowDayData = () => {
    const { tempFilters } = this.state;
    tempFilters.showDayData = !tempFilters.showDayData;
    this.setState({ tempFilters: { ...tempFilters } });
  }

  // This fxn will update the actual filters
  onSubmitUpdateFilters = async () => {
    const { tempFilters } = this.state;
    this.setState({
      showFilterModal: false,
      filters: { ...tempFilters },
      filteredData: await fetchFilteredData(tempFilters, CFM)
    });
  }

  render() {
    const { showFilterModal, filters, tempFilters, filteredData } = this.state;
    const labels = filteredData.map(datum => formatDateLabel(new Date(datum.time), filters.granularity));

    // First check if the data has been loaded yet. If it hasn't either filteredData will be null or filteredData.length will be 0
    // We also want to remove 'time' from the list of data keys (this simplifies looping through line graph keys)
    // Limiting to first 10 data columns so we don't overload the app
    const dataKeys = filteredData && filteredData.length ? Object.keys(filteredData[0]).filter(key => key !== 'time').slice(0, 10) : [];

    const sashData = {
      labels,
      datasets: dataKeys.map(key => {
        const colorIndex = dataKeys.indexOf(key);
        return {
          label: key,
          data: filteredData.map(datum => convertCFMToSash(datum[key])),
          borderColor: CHART_COLORS[colorIndex],
          backgroundColor: `${CHART_COLORS[colorIndex]}80`,
        };
      })
    };

    return (
      <div className="Sash-Chart">
        <Modal
          show={showFilterModal}
          onHide={this.onHideFilterModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Filter Sash Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <span className="modal-label">Look at Past</span>
              <ButtonGroup className="mb-2" aria-label="Average Over">
                {RELATIVE_TIME_RANGES.map((range, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`time-ranges-${idx}`}
                    type="radio"
                    variant="primary"
                    name="time-ranges-radio"
                    value={range}
                    checked={tempFilters.relativeTimeRange === range}
                    onChange={e => this.onChangeTimeRange(e.currentTarget.value)}
                  >
                    {range}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </div>
            <br />
            <div>
              <span className="modal-label">Average Over</span>
              <ButtonGroup className="mb-2" aria-label="Average Over">
                {TIME_GRANULARITIES.map((granularity, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`time-granularities-${idx}`}
                    type="radio"
                    variant="primary"
                    name="time-granularities-radio"
                    value={granularity}
                    checked={tempFilters.granularity === granularity}
                    onChange={e => this.onChangeTempGranularity(e.currentTarget.value)}
                  >
                    {granularity}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </div>
            <br />
            <span>
              <label htmlFor='show-day-data'>Show Day Data</label>
              <Toggle
                id='show-day-data'
                defaultChecked={tempFilters.showDayData}
                onChange={this.onChangeTempShowDayData}
              />
            </span>
            <br />
            <br />
            <Button variant="primary" onClick={this.onSubmitUpdateFilters}>Update Filters</Button>
          </Modal.Body>
        </Modal>
        <Button onClick={this.onShowFilterModal}>Filter Sash Data</Button>
        <Line options={generateChartOptions(SASH)} data={sashData} />
      </div>
    );
  }
}

export default SashChart;
