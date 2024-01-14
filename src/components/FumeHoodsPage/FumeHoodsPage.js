import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { withAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import ModalForm from '../../utils/components/ModalForm/ModalForm';
import {
  // Recoil states
  AVAILABLE_SENSORS_STATE,
  USER_INFO_STATE,
} from '../../utils/Constants';

function FumeHoodsPage() {
  const [availableSensors, setAvailableSensors] = useRecoilState(AVAILABLE_SENSORS_STATE);
  const [userInfo, _] = useRecoilState(USER_INFO_STATE);
  // TODO set up modal form for creating new fume hood and editing fume hood info
  const [shouldShowModalForm, setShouldShowModalForm] = useState(false);

  return (
    <Container className='FumeHoodsPage' fluid>
      <Row>
	<Col md={3}>
	  <h3>Fume Hoods </h3>
	</Col>
	<Col/>
	<Col md="auto">
	  <Button onClick={() => setShouldShowModalForm(true)}>
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
	      <td>HEIGHT</td>
	      <td>EDIT</td>
	    </tr>
	  ))}
	</tbody>
      </Table>
    </Container>
  );
}

export default withAuth0(FumeHoodsPage);
