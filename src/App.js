import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Modal from 'react-bootstrap/Modal';
import Toggle from 'react-toggle'
import "react-toggle/style.css"

import SashChart from './components/SashChart/SashChart';
import {
  NONE,
  // DAY,
  // WEEK,
  // MONTH,
  // YEAR,
  TIME_GRANULARITIES,
} from './utils/Constants.js';
import {fetchFilteredData} from './utils/Utils.js';
import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilterModal: false,
      filters: {
        granularity: NONE,
        showDayData: false,
      },
      // These are the filters the user has SELECTED but hasn't SUBMITTED on the filter modal
      tempFilters: {
        granularity: NONE,
        showDayData: false,
      },
      filteredData: [],
    };
  }

  async componentDidMount() {
    const {filters} = this.state;
    this.setState({filteredData: await fetchFilteredData(filters)})
  }

  onShowFilterModal = () => {
    this.setState({showFilterModal: true})
  }

  onHideFilterModal = () => {
    const {filters} = this.state;
    this.setState({tempFilters: {...filters}, showFilterModal: false})
  }

  // This fxn only updates tempFilters
  onChangeTempGranularity = granularity => {
    const {tempFilters} = this.state;
    tempFilters.granularity = granularity;
    this.setState({tempFilters: {...tempFilters}});
  }

  // This fxn only updates tempFilters
  onChangeTempShowDayData = () => {
    const {tempFilters} = this.state;
    tempFilters.showDayData = !tempFilters.showDayData;
    this.setState({tempFilters: {...tempFilters}});
  }

  // This fxn will update the actual filters
  onSubmitUpdateFilters = async () => {
    const {tempFilters} = this.state;
    this.setState({
      showFilterModal: false,
      filters: {...tempFilters},
      filteredData: await fetchFilteredData(tempFilters)});
  }

  render() {
    const {showFilterModal, tempFilters, filteredData} = this.state;
    return (
      <div className="App">
        <Modal
          show={showFilterModal}
          onHide={this.onHideFilterModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Filter Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ButtonGroup className="mb-2">
              {Object.keys(TIME_GRANULARITIES).map((granularity, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant="primary"
                  name="radio"
                  value={granularity}
                  checked={tempFilters.granularity === granularity}
                  onChange={e => this.onChangeTempGranularity(e.currentTarget.value)}
                >
                  {granularity}
                </ToggleButton>
              ))}
            </ButtonGroup>
            <br/>
            <Toggle
              id='show-day-data'
              defaultChecked={tempFilters.showDayData}
              onChange={this.onChangeTempShowDayData}
            />
            <br/>
            <label htmlFor='show-day-data'>Show Day Data</label>
            <br/>
            <br/>
            <Button variant="primary" onClick={this.onSubmitUpdateFilters}>Update Filters</Button>
          </Modal.Body>
        </Modal>
        <Button variant="primary" onClick={this.onShowFilterModal}>Filter Data</Button>
        {filteredData.length && <SashChart filteredData={filteredData}/>}
      </div>
    );
  }
}

export default App;
