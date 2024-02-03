// OrganizationSummaryPage.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../Header/Header';
import DataTable from './components/DataTable/DataTable';
import './OrganizationSummaryPage.scss';
import './components/DataTable/DataTable.scss'

class OrganizationSummaryPage extends React.Component {
  constructor() {
    super();
    this.state = {
      allSensorsData: [
        { name: 'Larry Herman', lab: 'Iribe Lab', accountType: 'Lecturer', joined: '1/1/70', preferredHood: '13', efficiencyScore: 'Very Low' },
        { name: 'Nelson P', lab: 'Letters and Science Lab', accountType: 'Professor', joined: '12/1/03', preferredHood: '11', efficiencyScore: 'Medium' },
        { name: 'Justin Destroyer', lab: 'Passing Grade Lab', accountType: 'God', joined: '12/1/20', preferredHood: '23', efficiencyScore: 'Very High' },
        { name: 'Clyde Kruskal', lab: 'Algos Lab', accountType: 'Clyde', joined: '12/1/03', preferredHood: '01', efficiencyScore: 'High' },
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
