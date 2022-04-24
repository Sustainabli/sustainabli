import React from 'react';
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
import "react-toggle/style.css";

import {
  CHART_COLORS,
  CFM,
  ROOM_FILTERS,
  ALL_ROOMS,
} from '../../utils/Constants.js';
import {
  formatDateLabel,
  generateChartOptions
} from '../../utils/Utils.js';

import './CFMChart.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
);

class CFMChart extends React.Component {

  render() {
    const { filters, filteredData } = this.props;
    const labels = filteredData.map(datum => formatDateLabel(new Date(datum.time), filters.granularity));

    // First check if the data has been loaded yet. If it hasn't either filteredData will be null or filteredData.length will be 0
    // We also want to remove 'time' from the list of data keys (this simplifies looping through line graph keys)
    // Limiting to first 10 data columns so we don't overload the app
    let dataKeys = filteredData && filteredData.length ? Object.keys(filteredData[0]).filter(key => key !== 'time').filter(key => {
      if (filters.selectedLab === "all") {
        let toFilter = false;
        ALL_ROOMS.forEach(room => {
          if (key.includes(room) && key.includes("Total")) {
            toFilter = true;
          }
        });
        return toFilter;
      } else {
        let toFilter = false;
        ROOM_FILTERS[filters.selectedLab].forEach(room => {
          if (key.includes(room) && (!key.includes("Total"))) {
            toFilter = true;
          }
        });
        return toFilter;
      }
    }) : [];

    let rodriquezVals = [];
    if (filters.selectedLab === "all") {
      filteredData.forEach(datum => {
        rodriquezVals.push(Object.keys(datum).filter(key => (key.includes("Total") && (key.includes("2360") || key.includes("2364") || key.includes("2368")))).reduce((prev, curr) => {
          dataKeys = dataKeys.filter(key => key !== curr);
          return prev += datum[curr]
        }, 0));
      });
      // dataKeys.reduce((prev, curr) => {
      //   if ((curr.includes("Total") && (curr.includes("2360") || curr.includes("2364") || curr.includes("2368")))) {
      //     console.log(prev, filteredData[curr], curr, filteredData['FMGTAP012L01_B091_ChemistryW3_Room2360_FumeHoodAll_TotalExhaustCFM_Tridium'], filteredData);
      //     prev += filteredData[curr];
      //     dataKeys.filter(key => key !== curr);
      //   }
      //   return prev;
      // }, 0);
      // dataKeys.push("Rodriquez Lab");
      // filteredData["Rodriquez Lab"] = rodriquezVal;
    }
    rodriquezVals = rodriquezVals.map(val => val / ROOM_FILTERS.rodriguez.length);

    let wangVals = [];
    if (filters.selectedLab === "all") {
      filteredData.forEach(datum => {
        wangVals.push(Object.keys(datum).filter(key => (key.includes("Total") && (key.includes("1302") || key.includes("1308")))).reduce((prev, curr) => {
          dataKeys = dataKeys.filter(key => key !== curr);
          return prev += datum[curr]
        }, 0));
      });
    }
    wangVals = wangVals.map(val => val / ROOM_FILTERS.wang.length);
    // if (filters.selectedLab === "all") {
    //   dataKeys.reduce((prev, curr) => {
    //     if ((curr.includes("Total") && (curr.includes("1302") || curr.includes("1308")))) {
    //       prev += filteredData[curr];
    //       dataKeys.filter(key => key !== curr);
    //     }
    //     return prev;
    //   }, 0);
    //   dataKeys.push("Wang Lab");
    //   filteredData["Wang Lab"] = rodriquezVal;
    // }

    const CFMData = {
      labels,
      datasets: dataKeys.map(key => {
        const colorIndex = dataKeys.indexOf(key);
        let label = key;
        if (filters.selectedLab === "all") {
          if (key.includes("3336")) {
            label = "Issacs Lab";
          } else if (key.includes("3356")) {
            label = "Falvey Lab";
          }
        }
        return {
          label: label,
          data: filteredData.map(datum => datum[key]),
          borderColor: CHART_COLORS[colorIndex],
          backgroundColor: `${CHART_COLORS[colorIndex]}80`,
        };
      })
    };

    if (filters.selectedLab === "all") {
      CFMData.datasets.push({
        label: "Rodriquez Lab",
        data: rodriquezVals,
        borderColor: CHART_COLORS[2],
        backgroundColor: `${CHART_COLORS[2]}80`,
      });

      CFMData.datasets.push({
        label: "Wang Lab",
        data: wangVals,
        borderColor: CHART_COLORS[3],
        backgroundColor: `${CHART_COLORS[3]}80`,
      });
    }

    return (
      <div className="CFM-Chart">
        <Line options={generateChartOptions(CFM)} data={CFMData} />
      </div>
    );
  }
}

export default CFMChart;
