// OrganizationSummaryPage.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../Header/Header';
import DataTable from './components/DataTable/DataTable';
import './OrganizationSummaryPage.scss';

class OrganizationSummaryPage extends React.Component {
  constructor() {
    super();
    this.state = {
      allSensorsData: [
        { name: 'Jane Doe', lab: 'Rodriguez Lab', accountType: 'Scientist', joined: '12/1/23', preferredHood: '23', efficiencyScore: 'Very Low' },
        { name: 'Tom Brady', lab: 'Patriot Lab', accountType: 'QB', joined: '12/1/03', preferredHood: '11', efficiencyScore: 'Very High' },
        { name: 'Bill B', lab: 'Patriot Lab', accountType: 'Coach', joined: '12/1/03', preferredHood: '11', efficiencyScore: 'Medium' },
        { name: 'IHaveAVeryLongNameForTestPurposes', lab: 'Patriot Lab', accountType: 'Coach', joined: '12/1/03', preferredHood: '11', efficiencyScore: 'High' },
      ],
    };
  }

  componentDidMount = async () => {
    // Fetch or simulate fetching data here
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

export default OrganizationSummaryPage;
