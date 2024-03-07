import React from "react";
import Table from "react-bootstrap/Table";
import {
  DAYS_IN_YEARS,
  // Metric Types
  METRIC_TYPE_AIRFLOW,
  METRIC_TYPE_CARBON,
  METRIC_TYPE_COST,
  METRIC_TYPE_ENERGY,
  MILLISECONDS_CONVERSION,
  MIN_DATE,
} from "../../../../utils/Constants";
import { convertSashOpennessToMetricValueAverage } from "../../../../utils/Utils";

function ImpactTable(props) {
  const { availableSensors, summedDataValues, availableAccounts } = props;

  const numBuildings = new Set(availableSensors.map((ele) => ele.building));

  // We can also directly query db for groups
  const labs = new Set(availableSensors.map((ele) => ele.groups).flat());

  const to_date_energy = convertSashOpennessToMetricValueAverage(
    METRIC_TYPE_ENERGY,
    summedDataValues
  );

  const to_date_cost = convertSashOpennessToMetricValueAverage(
    METRIC_TYPE_COST,
    summedDataValues
  );

  const to_date_carbon = convertSashOpennessToMetricValueAverage(
    METRIC_TYPE_CARBON,
    summedDataValues
  );

  const cells = (value, units) => {
    return (
      <td>
        <React.Fragment>{value}</React.Fragment>
        <br />
        {units}
      </td>
    );
  };

  //2023 hardcoded, details in overview page
  // difference in milliseconds
  const date_diff = Math.abs(new Date() - MIN_DATE) / MILLISECONDS_CONVERSION;

  return (
    <Table borderless>
      <tbody>
        <tr>
          <th>Year-to-Date</th>
          {cells(to_date_energy, "MWh")}
          {cells(to_date_cost, "USD")}
          {cells(to_date_carbon, "tCO2e")}
        </tr>
        <tr>
          <th>Projected Yearly</th>
          {cells(
            ((to_date_energy / date_diff) * DAYS_IN_YEARS * 2).toFixed(2),
            "MWh"
          )}
          {cells(
            ((to_date_cost / date_diff) * DAYS_IN_YEARS * 2).toFixed(2),
            "USD"
          )}
          {cells(
            ((to_date_carbon / date_diff) * DAYS_IN_YEARS * 2).toFixed(2),
            "tCO2e"
          )}
        </tr>
        <tr>
          <th>Engagement</th>
          {cells(labs.size, "Labs")}
          {cells(availableAccounts.length, "Scientists")}
          <td></td>
        </tr>
        <tr>
          <th>Sashimi Network</th>
          {cells(availableSensors.length, "sensors")}
          {cells(summedDataValues.length, "datapoints")}
          {cells(numBuildings.size, "buildings")}
        </tr>
      </tbody>
    </Table>
  );
}

export default ImpactTable;
