import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useRecoilState } from 'recoil';
import DataTable from './components/DataTable';
import Header from '../../utils/components/Header/Header';
import { USER_INFO_STATE } from '../../utils/Constants';
import {
  fetchUsersInOrganization
} from '../../utils/Utils';
import './OrganizationPage.scss';

function OrganizationPage() {
  const [organizationUsers, setOrganizationUsers] = useState([]);
  const userInfo = useRecoilState(USER_INFO_STATE);
  useEffect(() => {
    const loadData = async() => {
      const queriedSensorData = await fetchUsersInOrganization(userInfo[0].organization_code);
      setOrganizationUsers(queriedSensorData);
    }
    if (organizationUsers.length == 0) {
      loadData();
    }
  }, [organizationUsers, userInfo]);

  return (
    <Container fluid className="OrganizationPage">
      <Header pageName={userInfo.organization_code}/>
        <Row>
          <Col xs={12}>
            <DataTable data={organizationUsers} />
          </Col>
        </Row>
    </Container>
  );
}

export default OrganizationPage;
