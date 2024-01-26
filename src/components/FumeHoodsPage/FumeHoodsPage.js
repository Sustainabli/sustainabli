import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { withAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Header from '../../utils/components/Header/Header';
import ModalForm from '../../utils/components/ModalForm/ModalForm';
import FumeTable from '../../utils/components/FumeTable/FumeTable';
import ProgressBar from 'react-bootstrap/ProgressBar';
import {
  // Form types
  UPDATE_FUME_HOOD_INFO,
  // Recoil states
  AVAILABLE_SENSORS_STATE,
  USER_INFO_STATE,
  UPDATE_FUME_HOOD_PAGE,
  CREATE_FUME_HOOD,
  METRIC_TYPE_AIRFLOW,
} from '../../utils/Constants';
import {
	fetchAllSensorForOrganization,
	convertSashHeightToMetricValue
  } from '../../utils/Utils';

function FumeHoodsPage() {

  const editFumeModal = (sensorInfo) => {
	setShouldShowModalForm(true)
	setSensor(sensorInfo)
	setForm(UPDATE_FUME_HOOD_PAGE);
  }

  const createFumeModal = () => {
	setShouldShowModalForm(true)
	setSensor(null)
	setForm(CREATE_FUME_HOOD);
  }

  const closeModal = () => {
	setShouldShowModalForm(false)
	setSensor(null)
  }

  function findCFM(sensorName, arr) {
	let res = "HEIGHT"
	arr.forEach((ele) => {
		if (ele.fumeHood === sensorName) {
			res = <ProgressBar variant='info' now={ele.normalizedCfm}/>
		}
	})
	return res;
  }

  const [availableSensors, setAvailableSensors] = useRecoilState(AVAILABLE_SENSORS_STATE);
  const [userInfo, _] = useRecoilState(USER_INFO_STATE);
  // TODO set up modal form for creating new fume hood and editing fume hood info
  const [shouldShowModalForm, setShouldShowModalForm] = useState(false);
  const [sensor, setSensor] = useState(null);
  const [form, setForm] = useState("");
  const [allSensorsData, setAllSensorsData] = useState([])
  
  useEffect(() => {
	async function getSensorData() {
		const res = await fetchAllSensorForOrganization(userInfo.organization_code);
		setAllSensorsData(res);
	}
	getSensorData();
  }, [])

  const summedCfmData = {};
  allSensorsData.forEach(datum => Object.entries(datum.data).forEach(([key, value]) => {
	const cfmValue = convertSashHeightToMetricValue(METRIC_TYPE_AIRFLOW, value);
	summedCfmData[key] = key in summedCfmData ? summedCfmData[key] + cfmValue : cfmValue;
  }));

  // Take the largest cfm value, calculate the ratio for the progress bar, and sort summedCfmData in descending order based on this ratio
  const ratio = Math.max.apply(Math, Object.values(summedCfmData)) / 100;
  const orderedSummedCfmData = Object.entries(summedCfmData).map(([key, value]) => ({
	fumeHood: key,
	cfm: value,
	normalizedCfm: Math.round(value / ratio)
  }));
  orderedSummedCfmData.sort((a, b) => b.normalizedCfm - a.normalizedCfm);

  console.log(orderedSummedCfmData)
  console.log(availableSensors)

  return (
    <Container className='FumeHoodsPage' fluid>
		{
			shouldShowModalForm && 
			    <ModalForm
				formType={form}
				userInfo={userInfo}
				selectedUserInfo={null}
				selectedGroupInfo={null}
				selectedSensorInfo={sensor}
				selectedOrganizationInfo={null}
				clearModalFormType={closeModal}

				// States used by super admin
				allOrganizations={[]}

				// States used by organization admin
				allGroupsInOrganization={[]}
				allFumeHoodsInOrganization={[]}

				// Callbacks used by super admin
				updateAllOrganizationsList={null}
				updateAllSensorsList={null}
				updateAllOrganizationAdminUsers={null}

				// Callbacks used by organization admin
				updateAllGroupsInOrganization={null}
				updateAllUsersInOrganization={null}
				updateAllFumeHoodsInOrganizationList={null}
			/>
		}
      <Header pageName='Fume Hoods Page' />
      <Row>
	<Col md={3}>
	  <h3>Fume Hoods </h3>
	</Col>
	<Col/>
	<Col md="auto">
	  <Button onClick={() => createFumeModal(sensor)}>
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
	      <td>BUILDING</td>
	      <td>ROOM</td>
	      <td>LAB</td>
	      <td>{sensor.sensor_id}</td>
	      <td style={{width: '25%'}}>
		    {findCFM(sensor.fume_hood_name, orderedSummedCfmData)}
		  </td>
	      <td>
			<Button 
				className='showModalFormButton' 
		  		variant='dark'
				onClick={() => editFumeModal(sensor)}>
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
