import React, { useEffect } from "react";
import { withAuth0 } from "@auth0/auth0-react";
import { useRecoilState } from "recoil";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FumeTable from "../../utils/components/FumeTable/FumeTable";
import MetricsLineGraph from "../../utils/components/MetricsLineGraph/MetricsLineGraph";
import Header from "../../utils/components/Header/Header";
import {
  // Recoil states
  ALL_SENSORS_IN_ORGANIZATION_DATA_STATE,
  AVAILABLE_SENSORS_STATE,
  GROUPS_TO_FUME_HOODS_STATE,
  USER_INFO_STATE,
  AVAILABLE_ACCOUNTS_STATE,

  // Metric Types
  METRIC_TYPE_AIRFLOW,
  CURRENT_YEAR_DATE,
} from "../../utils/Constants";
import {
  convertSashOpennessToMetricValueAverage,
  fetchAllGroupFumeHoodsFromOrganization,
  fetchAllSensorForOrganization,
  fetchUsersInOrganization,
} from "../../utils/Utils";
import ImpactTable from "./components/ImpactTable/ImpactTable";
import FivePointSnapshot from "./components/FivePointSnapshot";

function OverviewPage() {
  // List of sensor data
  const [allSensorsInOrganizationData, setAllSensorsInOrganizationData] =
    useRecoilState(ALL_SENSORS_IN_ORGANIZATION_DATA_STATE);
  // List of sensor info
  const [availableSensors, setAvailableSensors] = useRecoilState(
    AVAILABLE_SENSORS_STATE
  );
  const [userInfo, _] = useRecoilState(USER_INFO_STATE);
  const [groupsToFumeHoods, setGroupsToFumeHoods] = useRecoilState(
    GROUPS_TO_FUME_HOODS_STATE
  );
  const [availableAccounts, setAvailableAccounts] = useRecoilState(
    AVAILABLE_ACCOUNTS_STATE
  );

  useEffect(() => {
    const loadData = async () => {
      // Load appropriate data if needed
      // Don't need to load availableSensors since App.js handles this
      if (allSensorsInOrganizationData.length === 0) {
        const currentDate = new Date();
        const allSensorsInOrganizationData =
          await fetchAllSensorForOrganization(
            userInfo.organization_code,
            CURRENT_YEAR_DATE,
            currentDate
          );
        setAllSensorsInOrganizationData(allSensorsInOrganizationData);
      }
      if (groupsToFumeHoods.length === 0) {
        const groupsToFumeHoods = await fetchAllGroupFumeHoodsFromOrganization(
          userInfo.organization_code
        );
        setGroupsToFumeHoods(groupsToFumeHoods);
      }
      if (availableAccounts.length === 0) {
        const availableAccounts = await fetchUsersInOrganization(
          userInfo.organization_code
        );
        setAvailableAccounts(availableAccounts);
      }
    };
    if (userInfo && userInfo.organization_code) {
      loadData();
    }
  }, [userInfo]);

  const summedDataValues = []; // Data for impact calculations
  const averageChartData = []; // Data points for charts
  const groupSummaryData = []; // Data for research labs section

  // Populate data for various sections
  allSensorsInOrganizationData.forEach((datum) => {
    const dataValues = Object.values(datum.data);

    const summedValues = dataValues.reduce((acc, curr) => acc + curr, 0);
    summedDataValues.push(summedValues);

    const averageChartDatum = {
      time: datum.time,
      data: {
        total: summedValues / dataValues.length,
      },
    };
    averageChartData.push(averageChartDatum);

    const groupSummaryValues = {};
    // For each group iterate through its fume hoods and push the fume hood data to groupSummaryDatum
    groupsToFumeHoods.forEach((groupFumeHoods) => {
      const fumeHoodValues = [];
      groupFumeHoods.fume_hoods.forEach((fume_hood) => {
        if (datum.data[fume_hood]) {
          fumeHoodValues.push(datum.data[fume_hood]);
        }
      });
      groupSummaryValues[groupFumeHoods.group_name] =
        convertSashOpennessToMetricValueAverage(
          METRIC_TYPE_AIRFLOW,
          fumeHoodValues
        );
    });
    const groupSummaryDatum = {
      time: datum.time,
      data: groupSummaryValues,
    };
    groupSummaryData.push(groupSummaryDatum);
  });

  console.log(averageChartData)

  return (
    <Container fluid>
      <Header pageName="Overview Page" />
      <Row>
        <Col>
          <Row>
            <h4>AVERAGE SASH HEIGHT</h4>
            {averageChartData.length > 0 && (
              <MetricsLineGraph data={averageChartData} />
            )}
          </Row>
          <Row>
            <h4>5-PT SNAPSHOT</h4>
            <FivePointSnapshot/>
          </Row>
        </Col>
        <Col>
          <Row>
            <h4>ATTENTION</h4>
          </Row>
          <Row>
            <h4>IMPACT</h4>
            <ImpactTable summedDataValues={summedDataValues} />
          </Row>
          <Row>
            <h4>RESEARCH LABS</h4>
            <FumeTable data={groupSummaryData} isGroup={true} />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default withAuth0(OverviewPage);
