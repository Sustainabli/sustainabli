// OrganizationSummaryPage.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../Header/Header';
import DataTable from './components/DataTable/DataTable';
import './OrganizationSummaryPage.scss';
import './components/DataTable/DataTable.scss';
import { withAuth0 } from '@auth0/auth0-react';
import { FETCH_ALL_SENSOR_DATA_FOR_ORGANIZATION_PATH, FETCH_USER_INFO_PATH } from '../../utils/Constants';

class OrganizationSummaryPage extends React.Component {
  constructor() {
    super();
    this.state = {
      allSensorsData: [], 
    };
  }

  componentDidMount = async () => {
    const { user } = this.props.auth0; 
    const userEmail = user.email; 
    try {
      const userInfoResponse = await fetch(FETCH_USER_INFO_PATH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }), 
      });

      if (!userInfoResponse.ok) {
        throw new Error(`HTTP error! Status: ${userInfoResponse.status}`);
      }

      const userInfo = await userInfoResponse.json();
      const organizationCode = userInfo.organization_code; 

      const sensorDataResponse = await fetch(FETCH_ALL_SENSOR_DATA_FOR_ORGANIZATION_PATH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organization_code: organizationCode }), 
      });

      if (!sensorDataResponse.ok) {
        throw new Error(`HTTP error! Status: ${sensorDataResponse.status}`);
      }

      const rawData = await sensorDataResponse.json();
      console.log(rawData);
  
      const data = rawData.map(item => ({
        name: item.fume_hood_name, 
        // Currently Un-used
        // day: item.day || 'N/A', 
        // time: item.time, 
        // value: item.value || 'N/A', 
        // status: item.status || 'N/A',
        // error_message: item.erro_message || 'N/A',
        lab: item.lab || 'N/A', 
        accountType: item.account_type || 'N/A', 
        joined: item.joined ? new Date(item.joined).toLocaleDateString() : 'N/A',
        preferredHood: item.preferred_hood || 'N/A', 
        efficiencyScore: item.efficiency_score || 'N/A' 
      }));
  
      this.setState({ allSensorsData: data });
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
  }
  

  render() {
    const { allSensorsData } = this.state;

    return (
      <Container fluid className="organizationSummaryPage">
        <Header pageName="UNIVERSITY OF MARYLAND, COLLEGE PARK"/>
        <Row>
          <Col xs={12}>
            <DataTable data={allSensorsData} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withAuth0(OrganizationSummaryPage);
