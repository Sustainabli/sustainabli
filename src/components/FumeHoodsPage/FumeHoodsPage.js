// Page that contains information about all sensors in an organization. This is only accessible to ORGANIZATION_ADMIN role.
//    - ORGANIZATION_ADMIN can edit fume hood information

import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import ProgressBar from "react-bootstrap/ProgressBar";
import FumeModalForm from "./components/FumeModalForm";
import Header from "../../utils/components/Header/Header";
import {
  // Form types
  UPDATE_FUME_HOOD_INFO,

  // Metric types
  METRIC_TYPE_AIRFLOW,

  // Query constants
  CURRENT_YEAR_DATE,
  TIME_GRANULARITIES,
} from "../../utils/Constants";
import { 
  userInfoSelector, 
  availableSensorInfoSelector, 
} from "../../utils/Recoil";
import { fetchSensorData } from "../../utils/Requests";
import { convertSashHeightToMetricValue } from "../../utils/Utils";

import "./FumeHoodsPage.scss";

function FumeHoodsPage() {
  const userInfo = useRecoilValue(userInfoSelector);
  const availableSensors = useRecoilValue(availableSensorInfoSelector);

  // When updating a sensor info, rather than having the app refetch the latest data, we store the new state in localAvailableSensors
  const [localAvailableSensors, setLocalAvailableSensors] = useState(availableSensors);
  const [shouldShowModalForm, setShouldShowModalForm] = useState(false);
  const [sensor, setSensor] = useState(null);
  const [form, setForm] = useState("");
  const [allSensorsData, setAllSensorsData] = useState([]);

  useEffect(() => {
    const loadData = async() => {
      const localAvailableSensorIds = localAvailableSensors.map(sensorInfo => sensorInfo.sensor_id);
      const allSensorsData = await fetchSensorData(TIME_GRANULARITIES.day, CURRENT_YEAR_DATE, new Date(), localAvailableSensorIds);
      setAllSensorsData(allSensorsData);
    }
    loadData();
  }, [localAvailableSensors]);

  const editFumeModal = (sensorInfo) => {
    setShouldShowModalForm(true);
    setSensor(sensorInfo);
    setForm(UPDATE_FUME_HOOD_INFO);
  };

  // const createFumeModal = () => {
  //   setShouldShowModalForm(true);
  //   setSensor(null);
  //   setForm(CREATE_SENSOR);
  // };

  const closeModal = () => {
    setShouldShowModalForm(false);
    setSensor(null);
  };

  // Generates the progress bar of each sensor. The progress bar is normalized based on the highest CFM value (i.e. the sensor with the highest CFM value will have progress 100% and all other sensors will have progress X% based on it's ratio with the highest CFM value)
  const createProgressBar = (sensorName, arr) => {
    const res = arr.find((ele) => ele.fumeHood === sensorName);
    return res ? (
      <ProgressBar variant="info" now={res.normalizedCfm} />
    ) : (
        "No Data to Show"
      );
  }

  // summedCfmData contains a mapping of sensorId to summed CFM values for the query range for that sensor
  // ex: {testMac: 835, testMax2: 2090}
  const summedCfmData = {};
  allSensorsData.forEach((datum) =>
    Object.entries(datum.data).forEach(([key, value]) => {
      const cfmValue = convertSashHeightToMetricValue(METRIC_TYPE_AIRFLOW, value);
      summedCfmData[key] = key in summedCfmData ? summedCfmData[key] + cfmValue : cfmValue;
    })
  );

  // Take the largest CFM value, calculate the ratio for the progress bar, and sort summedCfmData in descending order based on this ratio
  // orderSummedCfmData is a list of the sensors with the summed and normalized cfm
  // ex: [{fume_hood_name: testMac, cfm : 835, normalizedCfm: 40}, ...]
  const ratio = Math.max.apply(Math, Object.values(summedCfmData)) / 100;
  const orderedSummedCfmData = Object.entries(summedCfmData).map(([key, value]) => ({
      fumeHood: key,
      cfm: value,
      normalizedCfm: Math.round(value / ratio),
    })
  );
  orderedSummedCfmData.sort((a, b) => b.normalizedCfm - a.normalizedCfm);

  return (
    <Container className="FumeHoodsPage" fluid>
      {shouldShowModalForm && (
        <FumeModalForm
          formType={form}
          selectedSensorInfo={sensor}
          closeModal={closeModal}
          setLocalAvailableSensors={setLocalAvailableSensors}
        />
      )}
      <Header pageName="Fume Hoods Page" />
      <Row>
        <Col md={3}>
          <h3>Fume Hoods </h3>
        </Col>
        <Col />
        {/* TODO: determine if ORGANIZATION_ADMIN can add sensors to their organization or if it's a SUPER_ADMIN task */}
        {/* <Col md="auto"> */}
        {/*   <Button onClick={() => createFumeModal(sensor)} variant="info"> */}
        {/*     Create New Fume Hood */}
        {/*   </Button> */}
        {/* </Col> */}
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Fume Hood</th>
            <th>Org</th>
            <th>Building</th>
            <th>Room</th>
            <th>Lab</th>
            <th>Sensor ID/MAC</th>
            {/* TODO: this header doesn't make much sense */}
            <th>Real-Time Sash Height</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {localAvailableSensors.map((sensor, index) => (
            <tr key={index}>
              <td>{sensor.fume_hood_name}</td>
              <td>{userInfo.organization_code}</td>
              <td>{sensor.building}</td>
              <td>{sensor.room}</td>
              <td>
                {sensor.groups.join(", ")}
              </td>
              <td>{sensor.sensor_id}</td>
              {/* Unable to set progress bar to 25% of table width through scss so doing inline styling instead */}
              <td style={{ width: "25%" }}>
                {createProgressBar(sensor.fume_hood_name, orderedSummedCfmData)}
              </td>
              <td>
                <Button
                  className="showModalFormButton"
                  variant="dark"
                  onClick={() => editFumeModal(sensor)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default FumeHoodsPage;
