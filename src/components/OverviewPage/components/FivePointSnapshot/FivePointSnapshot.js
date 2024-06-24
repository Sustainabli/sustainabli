import { useRecoilValue } from "recoil";
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
import {
  TIME_GRANULARITIES,

  SNAPSHOT_COLORS,
  PARTITION_LABELS,
} from "../../../../utils/Constants";
import { sensorDataFromOrganizationSelector } from "../../../../utils/Recoil";
import { formatDateLabel } from "../../../../utils/Utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function FivePointSnapshot() {
  const organizationSensorData = useRecoilValue(sensorDataFromOrganizationSelector);

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

  const manipulateData = organizationSensorData.map((ele) => {
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
    }, new Array(PARTITION_LABELS.length).fill(0));
  });

  const data = {
    labels: organizationSensorData.map((datum) =>
      formatDateLabel(new Date(datum.time), TIME_GRANULARITIES.day)
    ),
    datasets: manipulateData.length === 0 ? [] : manipulateData[0].map((_, index) => ({
      label: PARTITION_LABELS[index],
      data: manipulateData.map((row) => row[index]),
      backgroundColor: SNAPSHOT_COLORS[index],
    })),
  };

  return <Bar options={options} data={data} />;
}

export default FivePointSnapshot;
