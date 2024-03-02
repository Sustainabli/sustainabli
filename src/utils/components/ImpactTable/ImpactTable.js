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

  const num_buildings = new Set(availableSensors.map((ele) => ele.building))

  // We can also directly query db for groups
  const labs = new Set(availableSensors.map((ele) => ele.groups).flat())


  return (
    <Table borderless>
      <tbody>
        <tr>
          <th>Year-to-Date</th>
          <td>
            <React.Fragment>
              {convertSashOpennessToMetricValueAverage(
                METRIC_TYPE_ENERGY,
                summedDataValues
              )}
            </React.Fragment>
            <br />
            MWh
          </td>
          <td>
            <React.Fragment>
              {convertSashOpennessToMetricValueAverage(
                METRIC_TYPE_COST,
                summedDataValues
              )}
            </React.Fragment>
            <br />
            USD
          </td>
          <td>
            <React.Fragment>
              {convertSashOpennessToMetricValueAverage(
                METRIC_TYPE_CARBON,
                summedDataValues
              )}
            </React.Fragment>
            <br />
            tCO2e
          </td>
        </tr>
        <tr>
          <th>Projected Yearly</th>
          <td>
            <React.Fragment>
              {convertSashOpennessToMetricValueAverage(
                METRIC_TYPE_ENERGY,
                summedDataValues
              )}
            </React.Fragment>
            <br />
            MWh
          </td>
          <td>
            <React.Fragment>
              {convertSashOpennessToMetricValueAverage(
                METRIC_TYPE_COST,
                summedDataValues
              )}
            </React.Fragment>
            <br />
            USD
          </td>
          <td>
            <React.Fragment>
              {convertSashOpennessToMetricValueAverage(
                METRIC_TYPE_CARBON,
                summedDataValues
              )}
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
            <br/>
            Scientists
          </td>
          <td>??? Active Users</td>
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
