import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import "react-toggle/style.css";
import {
  YEAR,
  ALL,
  CFM,
  ONE_WEEK,
} from '../../utils/Constants.js';
import {
  fetchFilteredData,
} from '../../utils/Utils.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

class CFMChangeBarGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldData: [],
      newData: []
    }
  }

  async componentDidMount() {
    const oldFilters = {
      granularity: YEAR,
      timePeriod: ALL,
      timeOfDay: "all",
      dateOffset: "2022-03-31",
    }
    const newFilters = {
      granularity: YEAR,
      timePeriod: ONE_WEEK,
      timeOfDay: "all",
      dateOffset: "2022-04-30",
    }
    this.setState({ oldData: await fetchFilteredData(oldFilters, CFM), newData: await fetchFilteredData(newFilters, CFM) });
  }
  render() {
    const {
      oldData,
      newData,
    } = this.state;
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Changes in CFM Averages Before and During the Competition',
          color: '#000000',
          font: {
            size: 30,
          }
        },
      },
    };
    const labels = ['Issacs Lab', 'Falvey Lab', 'Rodriguez Lab', 'Wang Lab'];
    const oldDataForChart = [];
    const newDataForChart = [];
    if (oldData[0]) {
      oldDataForChart.push(oldData[0].FMGTAP012L01_B091_ChemistryW3_Room3336_FumeHoodAll_TotalExhaustCFM_Tridium / 4);
      oldDataForChart.push(oldData[0].FMGTAP012L01_B091_ChemistryW3_Room3356_FumeHoodAll_TotalExhaustCFM_Tridium / 4);
      oldDataForChart.push((oldData[0].FMGTAP012L01_B091_ChemistryW3_Room2360_FumeHoodAll_TotalExhaustCFM_Tridium + oldData[0].FMGTAP012L01_B091_ChemistryW3_Room2364_FumeHoodAll_TotalExhaustCFM_Tridium + oldData[0].FMGTAP012L01_B091_ChemistryW3_Room2368_FumeHoodAll_TotalExhaustCFM_Tridium) / 10);
      oldDataForChart.push((oldData[0].FMGTAP012L01_B091_ChemistryW3_Room1302_FumeHoodAll_TotalExhaustCFM_Tridium + oldData[0].FMGTAP012L01_B091_ChemistryW3_Room1308_FumeHoodAll_TotalExhaustCFM_Tridium) / 17);
      newDataForChart.push(newData[0].FMGTAP012L01_B091_ChemistryW3_Room3336_FumeHoodAll_TotalExhaustCFM_Tridium / 4);
      newDataForChart.push(newData[0].FMGTAP012L01_B091_ChemistryW3_Room3356_FumeHoodAll_TotalExhaustCFM_Tridium / 4);
      newDataForChart.push((newData[0].FMGTAP012L01_B091_ChemistryW3_Room2360_FumeHoodAll_TotalExhaustCFM_Tridium + newData[0].FMGTAP012L01_B091_ChemistryW3_Room2364_FumeHoodAll_TotalExhaustCFM_Tridium + newData[0].FMGTAP012L01_B091_ChemistryW3_Room2368_FumeHoodAll_TotalExhaustCFM_Tridium) / 10);
      newDataForChart.push((newData[0].FMGTAP012L01_B091_ChemistryW3_Room1302_FumeHoodAll_TotalExhaustCFM_Tridium + newData[0].FMGTAP012L01_B091_ChemistryW3_Room1308_FumeHoodAll_TotalExhaustCFM_Tridium) / 17);
    }
    const data = {
      labels,
      datasets: [
        {
          label: 'January-March CFM Average',
          data: oldDataForChart,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'April 24-30 CFM Average',
          data: newDataForChart,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };
    return (
      <div className="CFM-Change-Bar-Graph">
        <Bar options={options} data={data}/>
        <br/>
        <br/>
        <div>
          Issacs Lab has saved {((oldDataForChart[0] - newDataForChart[0]) * 35.71 / 52).toFixed(2)} kwh of energy this competition so far
        </div>
        <br/>
        <div>
          Falvey Lab has saved {((oldDataForChart[1] - newDataForChart[1]) * 35.71 / 52).toFixed(2)} kwh of energy this competition so far
        </div>
        <br/>
        <div>
          Rodriguez Lab has saved {((oldDataForChart[2] - newDataForChart[2]) * 35.71 / 52).toFixed(2)} kwh of energy this competition so far
        </div>
        <br/>
        <div>
          Wang Lab has saved {((oldDataForChart[3] - newDataForChart[3]) * 35.71 / 52).toFixed(2)} kwh of energy this competition so far
        </div>
        <br/>
      </div>
    );
  }
}


export default CFMChangeBarGraph;
