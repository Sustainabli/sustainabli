import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { withAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Header from "../../utils/components/Header/Header";
import ProgressBar from "react-bootstrap/ProgressBar";
import FumeModalForm from "./components/FumeModalForm";
import "./FumeHoodsPage.scss";
import {
  // Form types
  UPDATE_FUME_HOOD_INFO,
  CREATE_SENSOR,
  // Recoil states
  USER_INFO_STATE,
  METRIC_TYPE_AIRFLOW,
} from "../../utils/Constants";
import {
  fetchAllSensorForOrganization,
  convertSashHeightToMetricValue,
} from "../../utils/Utils";

function FumeHoodsPage(props) {
  const editFumeModal = (sensorInfo) => {
    setShouldShowModalForm(true);
    setSensor(sensorInfo);
    setForm(UPDATE_FUME_HOOD_INFO);
  };

  const createFumeModal = () => {
    setShouldShowModalForm(true);
    setSensor(null);
    setForm(CREATE_SENSOR);
  };

  const closeModal = () => {
    setShouldShowModalForm(false);
    setSensor(null);
  };

  function findCFM(sensorName, arr) {
    const res = arr.find((ele) => ele.fumeHood === sensorName);
    return res ? (
      <ProgressBar variant="info" now={res.normalizedCfm} />
    ) : (
      "No Data to Show"
    );
  }

  // availableSensors is a list of the possible sensors
  // ex: [{fume_hood_name: 'testMac', organization_code: 'TTT', sensor_id: 'testMac'}, ...]
  const { availableSensors, updateSensors } = props;

  const [userInfo, _] = useRecoilState(USER_INFO_STATE);
  const [shouldShowModalForm, setShouldShowModalForm] = useState(false);
  const [sensor, setSensor] = useState(null);
  const [form, setForm] = useState("");

  // allSensorsData is a list of js objects which contains the Cfm? at a specific time
  // ex: [{data : {testMac: 5.625, testMax2: 65}, time: "2023"}, ...]
  const [allSensorsData, setAllSensorsData] = useState([]);

  useEffect(() => {
    async function getSensorData() {
      const res = await fetchAllSensorForOrganization(
        userInfo.organization_code,
        new Date(2023, 0, 1),
        new Date()
      );
      setAllSensorsData(res);
    }
    getSensorData();
  }, []);

  // summedCfmData is an object with the sensors and the summed cfm
  // ex: {testMac: 835, testMax2: 2090}
  const summedCfmData = {};
  allSensorsData.forEach((datum) =>
    Object.entries(datum.data).forEach(([key, value]) => {
      const cfmValue = convertSashHeightToMetricValue(
        METRIC_TYPE_AIRFLOW,
        value
      );
      summedCfmData[key] =
        key in summedCfmData ? summedCfmData[key] + cfmValue : cfmValue;
    })
  );

  // Take the largest cfm value, calculate the ratio for the progress bar, and sort summedCfmData in descending order based on this ratio

  // orderSummedCfmData is a list of the sensors with the summed and normalized cfm
  // ex: [{fume_hood_name: testMac, cfm : 835, normalizedCfm: 40}, ...]
  const ratio = Math.max.apply(Math, Object.values(summedCfmData)) / 100;
  const orderedSummedCfmData = Object.entries(summedCfmData).map(
    ([key, value]) => ({
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
          clearModalFormType={closeModal}
          updateSensor={updateSensors}
        />
      )}
      <Header pageName="Fume Hoods Page" />
      <Row>
        <Col md={3}>
          <h3>Fume Hoods </h3>
        </Col>
        <Col />
        <Col md="auto">
          <Button onClick={() => createFumeModal(sensor)} variant="info">
            Create New Fume Hood
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Fume Hood</th>
            <th>Org</th>
            <th>Building</th>
            <th>Room</th>
            <th>Lab</th>
            <th>Sensor MAC</th>
            <th>Real-Time Sash Height</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {availableSensors.map((sensor, index) => (
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
                {findCFM(sensor.fume_hood_name, orderedSummedCfmData)}
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

export default withAuth0(FumeHoodsPage);
