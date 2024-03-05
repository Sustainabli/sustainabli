import React from "react";
import Table from "react-bootstrap/Table";
import {
  // Metric Types
  METRIC_TYPE_AIRFLOW,
  METRIC_TYPE_CARBON,
  METRIC_TYPE_COST,
  METRIC_TYPE_ENERGY,
} from "../../Constants";
import { convertSashOpennessToMetricValueAverage } from "../../Utils";

function ImpactTable(props) {
  const { availableSensors, summedDataValues, availableAccounts } = props;

  const num_buildings = new Set(availableSensors.map((ele) => ele.building));

  // We can also directly query db for groups
  const labs = new Set(availableSensors.map((ele) => ele.groups).flat());

  const to_date_energy = convertSashOpennessToMetricValueAverage(
    METRIC_TYPE_ENERGY,
    summedDataValues
  );

  const to_date_cost = convertSashOpennessToMetricValueAverage(
    METRIC_TYPE_COST,
    summedDataValues
  )

  const to_date_carbon = convertSashOpennessToMetricValueAverage(
    METRIC_TYPE_CARBON,
    summedDataValues
  )

  //2023 hardcoded, details in overview page
  // difference in milliseconds
  const date_diff = Math.abs(new Date() - new Date(2023, 0, 1)) / 86400000

  console.log(date_diff)

  const projected_energy = to_date_energy / date_diff * 365 * 2

  const projected_cost = to_date_cost / date_diff * 365 * 2

  const projected_carbon = to_date_carbon / date_diff * 365 * 2

  return (
    <Table borderless>
      <tbody>
        <tr>
          <th>Year-to-Date</th>
          <td>
            <React.Fragment>
              {to_date_energy}
            </React.Fragment>
            <br />
            MWh
          </td>
          <td>
            <React.Fragment>
              {to_date_cost}
            </React.Fragment>
            <br />
            USD
          </td>
          <td>
            <React.Fragment>
              {to_date_carbon}
            </React.Fragment>
            <br />
            tCO2e
          </td>
        </tr>
        <tr>
          <th>Projected Yearly</th>
          <td>
            <React.Fragment>
              {projected_energy.toFixed(2)}
            </React.Fragment>
            <br />
            MWh
          </td>
          <td>
            <React.Fragment>
              {projected_cost.toFixed(2)}
            </React.Fragment>
            <br />
            USD
          </td>
          <td>
            <React.Fragment>
              {projected_carbon.toFixed(2)}
            </React.Fragment>
            <br />
            tCO2e
          </td>
        </tr>
        <tr>
          <th>Engagement</th>
          <td>
            {labs.size}
            <br />
            Labs
          </td>
          <td>
            {availableAccounts.length}
            <br />
            Scientists
          </td>
          <td></td>
        </tr>
        <tr>
          <th>Sashimi Network</th>
          <td>
            <React.Fragment>{availableSensors.length}</React.Fragment>
            <br />
            sensors
          </td>
          <td>
            {summedDataValues.length}
            <br />
            datapoints
          </td>
          <td>
            {num_buildings.size}
            <br />
            buildings
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

export default ImpactTable;
