import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { formatDateLabel } from "../../../utils/Utils";
import { TIME_GRANULARITIES } from "../../../utils/Constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function FivePointSnapshot(props) {
  const { sensorData } = props;

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Number of Fume Hoods",
        },
      },
    },
  };

  // attempt to generalize code
  // const partitions = [0, 10, 25, 45]

  // 5 is hardcoded -> prob use constant to determine how many partitions in bar graph
  const manipulateData = sensorData.map((ele) => {
    return Object.values(ele.data).reduce((res, ele2) => {
      if (ele2 <= 0) {
        res[0] += 1;
      } else if (0 < ele2 && ele2 < 10) {
        res[1] += 1;
      } else if (10 <= ele2 && ele2 < 25) {
        res[2] += 1;
      } else if (25 <= ele2 && ele2 < 45) {
        res[3] += 1;
      } else {
        res[4] += 1;
      }
      return res;
    }, new Array(5).fill(0));
  });

  const partitionLabels = ["Closed", "0-10cm", "10-25cm", "25-45cm", "> 45cm"];
  const colors = [
    "rgb(135, 211, 0)",
    "rgb(246,230,0)",
    "rgb(239,165,0)",
    "rgb(199,0,5)",
    "rgb(140,26,255)",
  ];

  const data = {
    labels: sensorData.map((datum) =>
      formatDateLabel(new Date(datum.time), TIME_GRANULARITIES.day)
    ),
    datasets: manipulateData[0].map((_, index) => ({
      label: partitionLabels[index],
      data: manipulateData.map((row) => row[index]),
      backgroundColor: colors[index],
    })),
  };

  return <Bar options={options} data={data} />;
}

export default FivePointSnapshot;
