import { React } from "react";
import { useRecoilState } from "recoil";
import {
  ALL_SENSORS_IN_ORGANIZATION_DATA_STATE,
  NUM_OF_CATEGORIES,
  SNAPSHOT_COLORS,
} from "../../../utils/Constants";
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

function FivePointSnapshot() {
  const [allSensorsInOrganizationData] = useRecoilState(
    ALL_SENSORS_IN_ORGANIZATION_DATA_STATE
  );

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

  // there's like a second where allSensorsInOrganizationData hasn't been rendered yet
  // which causes there to be a null mapping error if I don't have this if statement
  if (allSensorsInOrganizationData.length !== 0) {
    const manipulateData = allSensorsInOrganizationData.map((ele) => {
      return Object.values(ele.data).reduce((res, ele2) => {
        if (ele2 <= 0) {
          res[0] += 1;
        } else if (ele2 < 10) {
          res[1] += 1;
        } else if (ele2 < 25) {
          res[2] += 1;
        } else if (ele2 < 45) {
          res[3] += 1;
        } else {
          res[4] += 1;
        }
        return res;
      }, new Array(NUM_OF_CATEGORIES).fill(0));
    });

    // do we want to make this constant too?
    const partitionLabels = [
      "Closed",
      "0-10cm",
      "10-25cm",
      "25-45cm",
      "> 45cm",
    ];

    const data = {
      labels: allSensorsInOrganizationData.map((datum) =>
        formatDateLabel(new Date(datum.time), TIME_GRANULARITIES.day)
      ),
      datasets: manipulateData[0].map((_, index) => ({
        label: partitionLabels[index],
        data: manipulateData.map((row) => row[index]),
        backgroundColor: SNAPSHOT_COLORS[index],
      })),
    };

    return <Bar options={options} data={data} />;
  }
  return <></>;
}

export default FivePointSnapshot;
