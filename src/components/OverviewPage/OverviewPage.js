import React, { useEffect } from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import { useRecoilState } from 'recoil';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import FumeTable from '../../utils/components/FumeTable/FumeTable';
import MetricsLineGraph from '../../utils/components/MetricsLineGraph/MetricsLineGraph';
import Header from '../../utils/components/Header/Header';
import {
  // Recoil states
  ALL_SENSORS_IN_ORGANIZATION_DATA_STATE,
  AVAILABLE_SENSORS_STATE,
  GROUPS_TO_FUME_HOODS_STATE,
  USER_INFO_STATE,

  // Metric Types
  METRIC_TYPE_AIRFLOW,
  METRIC_TYPE_CARBON,
  METRIC_TYPE_COST,
  METRIC_TYPE_ENERGY,
} from '../../utils/Constants';
import {
  convertSashOpennessToMetricValueAverage,
  fetchAllGroupFumeHoodsFromOrganization,
  fetchAllSensorForOrganization
} from '../../utils/Utils';

function OverviewPage() {
  // List of sensor data
  const [allSensorsInOrganizationData, setAllSensorsInOrganizationData] = useRecoilState(ALL_SENSORS_IN_ORGANIZATION_DATA_STATE);
  // List of sensor info
  const [availableSensors, setAvailableSensors] = useRecoilState(AVAILABLE_SENSORS_STATE);
  const [userInfo, _] = useRecoilState(USER_INFO_STATE);
  const [groupsToFumeHoods, setGroupsToFumeHoods] = useRecoilState(GROUPS_TO_FUME_HOODS_STATE);

  useEffect(() => {
    const loadData = async () => {
      // Load appropriate data if needed
      // Don't need to load availableSensors since App.js handles this
      if (allSensorsInOrganizationData.length === 0) {
	const allSensorsInOrganizationData = await fetchAllSensorForOrganization(userInfo.organization_code);
	setAllSensorsInOrganizationData(allSensorsInOrganizationData);
      }
      if (groupsToFumeHoods.length === 0) {
	const groupsToFumeHoods = await fetchAllGroupFumeHoodsFromOrganization(userInfo.organization_code);
	setGroupsToFumeHoods(groupsToFumeHoods);
      }
    }
    if (userInfo && userInfo.organization_code) {
      loadData();
    }
  }, [userInfo]);

  const summedDataValues = []; // Data for impact calculations
  const averageChartData = [];      // Data points for charts
  const groupSummaryData = [];   // Data for research labs section

  // Populate data for various sections
  allSensorsInOrganizationData.forEach(datum => {
    const dataValues = Object.values(datum.data);

    const summedValues = dataValues.reduce((acc, curr) => acc + curr, 0);
    summedDataValues.push(summedValues);

    const averageChartDatum = {
      time: datum.time,
      data: {
	total: summedValues / dataValues.length
      }
    }
    averageChartData.push(averageChartDatum);

    const groupSummaryValues = {};
    // For each group iterate through its fume hoods and push the fume hood data to groupSummaryDatum
    groupsToFumeHoods.forEach(groupFumeHoods => {
      const fumeHoodValues = [];
      groupFumeHoods.fume_hoods.forEach(fume_hood => {
	if (datum.data[fume_hood]) {
	  fumeHoodValues.push(datum.data[fume_hood]);
	}
      });
      groupSummaryValues[groupFumeHoods.group_name] = convertSashOpennessToMetricValueAverage(METRIC_TYPE_AIRFLOW, fumeHoodValues);
    });
    const groupSummaryDatum = {
      time: datum.time,
      data: groupSummaryValues
    };
    groupSummaryData.push(groupSummaryDatum);
  });

  return (
    <Container fluid>
      <Header pageName='Overview Page' />
      <Row>
	<Col>
	  <Row>
	    <h4>AVERAGE SASH HEIGHT</h4>
	    {averageChartData.length > 0 && <MetricsLineGraph data={averageChartData}/>}
	  </Row>
	  <Row>
	    <h4>5-PT SNAPSHOT</h4>
	  </Row>
	</Col>
	<Col>
	  <Row>
	    <h4>ATTENTION</h4>
	  </Row>
	  <Row>
	    <h4>IMPACT</h4>
	    <Table borderless>
	      <tbody>
		<tr>
		  <td>Sashimi Network</td>
		  {/* TODO can probably commonize stuff below here into a helper function */}
		  <td>
		    <React.Fragment>
		      {availableSensors.length}
		    </React.Fragment>
		    <br/>
		    sensors
		  </td>
		  <td>
		    <React.Fragment>
		      {convertSashOpennessToMetricValueAverage(METRIC_TYPE_ENERGY, summedDataValues)}
		    </React.Fragment>
		    <br/>
		    MWh
		  </td>
		  <td>
		    <React.Fragment>
		      {convertSashOpennessToMetricValueAverage(METRIC_TYPE_CARBON, summedDataValues)}
		    </React.Fragment>
		    <br/>
		    tCO2e
		  </td>
		  <td>
		    <React.Fragment>
		      {convertSashOpennessToMetricValueAverage(METRIC_TYPE_COST, summedDataValues)}
		    </React.Fragment>
		    <br/>
		    USD
		  </td>
		</tr>
	      </tbody>
	    </Table>
	  </Row>
	  <Row>
	    <h4>RESEARCH LABS</h4>
	    <FumeTable data={groupSummaryData} isGroup={true}/>
	  </Row>
	</Col>
      </Row>
    </Container>
  );
}

export default withAuth0(OverviewPage);
