import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FumeTable from '../../utils/components/FumeTable/FumeTable';
import Header from '../../utils/components/Header/Header';
import MetricsLineGraph from '../../utils/components/MetricsLineGraph/MetricsLineGraph';
import {
  fetchAllGroupFumeHoodsFromOrganization,
  fetchAllSensorForOrganization
} from '../../utils/Utils';

// TODO redo this class to use recoil and match the figma. This was the old organization page so we need to redesign it
class OrganizationPage extends React.Component {
  constructor() {
    super();
    this.state = {
      allSensorsData: [],
      groupsToFumeHoods: [],
    };
  }

  componentDidMount = async () => {
    const { userInfo } = this.props;

    this.setState({
      allSensorsData: await fetchAllSensorForOrganization(userInfo.organization_code),
      groupsToFumeHoods: await fetchAllGroupFumeHoodsFromOrganization(userInfo.organization_code),
    });
  }

  render() {
    const { allSensorsData, groupsToFumeHoods } = this.state;

    const averageData = allSensorsData.map(datum => ({
      time: datum.time,
      data: {
	total: Object.values(datum.data).reduce((acc, curr) => acc + curr, 0)
      }
    }));

    const groupSummaryData = allSensorsData.map(datum => {
      const data = {};
      groupsToFumeHoods.forEach(groupFumeHoods => {
	data[groupFumeHoods.group_name] = groupFumeHoods.fume_hoods.reduce((acc, fumeHood) => {
	  if (datum.data[fumeHood]) {
	    return datum.data[fumeHood] + acc
	  }
	  return acc;
	}, 0);
      });

      return {
	time: datum.time,
	data: data,
      };
    });

    return (
      <Container className='OrganizationPage' fluid>
        <Header pageName='Organization Page' />
	{allSensorsData.length > 0 &&
	  <Row>
	    <Col md={6}>
	      <MetricsLineGraph data={averageData}/>
	      <FumeTable data={groupSummaryData} isGroup={true}/>
	    </Col>
	    <Col md={6}>
	      <FumeTable data={allSensorsData}/>
	    </Col>
	  </Row>
	}
      </Container>
    )
  }
}

export default OrganizationPage;
