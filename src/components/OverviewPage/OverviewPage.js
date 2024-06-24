// Page contains stats about the overall organization. This is only accessible to ORGANIZATION_ADMIN role.

import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ImpactTable from "./components/ImpactTable/ImpactTable";
import FivePointSnapshot from "./components/FivePointSnapshot/FivePointSnapshot";
import FumeTable from "../../utils/components/FumeTable/FumeTable";
import MetricsLineGraph from "../../utils/components/MetricsLineGraph/MetricsLineGraph";
import Header from "../../utils/components/Header/Header";
import {
  // Metric Types
  METRIC_TYPE_AIRFLOW,
} from "../../utils/Constants";
import {
  groupsToFumeHoodsSelector,
  sensorDataFromOrganizationSelector,
} from "../../utils/Recoil";
import {
  convertSashOpennessToMetricValueAverage,
} from "../../utils/Utils";

function OverviewPage() {
  const groupsToFumeHoods = useRecoilValue(groupsToFumeHoodsSelector);
  const organizationSensorData = useRecoilValue(sensorDataFromOrganizationSelector);

  const summedDataValues = []; // Data for impact calculations
  const averageChartData = []; // Data points for charts
  const groupSummaryData = []; // Data for research labs section

  // Populate data for various sections
  organizationSensorData.forEach((datum) => {
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

    // For each group iterate through its fume hoods and push the fume hood data to groupSummaryDatum
    const groupSummaryValues = {};
    groupsToFumeHoods.forEach((groupFumeHoods) => {
      const fumeHoodValues = [];
      groupFumeHoods.fume_hoods.forEach((fume_hood) => {
        if (datum.data[fume_hood]) {
          fumeHoodValues.push(datum.data[fume_hood]);
        }
      });
      groupSummaryValues[groupFumeHoods.group_name] = convertSashOpennessToMetricValueAverage(METRIC_TYPE_AIRFLOW, fumeHoodValues);
    });
    const groupSummaryDatum = {
      time: datum.time,
      data: groupSummaryValues,
    };
    groupSummaryData.push(groupSummaryDatum);
  });

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
            <FivePointSnapshot  />
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

export default OverviewPage;
