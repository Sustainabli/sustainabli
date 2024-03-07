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

  const toDateEnergy = convertSashOpennessToMetricValueAverage(
    METRIC_TYPE_ENERGY,
    summedDataValues
  );

  const toDateCost = convertSashOpennessToMetricValueAverage(
    METRIC_TYPE_COST,
    summedDataValues
  );

  const toDateCarbon = convertSashOpennessToMetricValueAverage(
    METRIC_TYPE_CARBON,
    summedDataValues
  );

  const renderCells = (value, units) => {
    return (
      <td>
        <React.Fragment>{value}</React.Fragment>
        <br />
        {units}
      </td>
    );
  };

  const date_diff = Math.abs(new Date() - MIN_DATE) / MILLISECONDS_CONVERSION;

  return (
    <Table borderless>
      <tbody>
        <tr>
          <th>Year-to-Date</th>
          {renderCells(toDateEnergy, "MWh")}
          {renderCells(toDateCost, "USD")}
          {renderCells(toDateCarbon, "tCO2e")}
        </tr>
        <tr>
          <th>Projected Yearly</th>
          {renderCells(
            ((toDateEnergy / date_diff) * DAYS_IN_YEARS).toFixed(2),
            "MWh"
          )}
          {renderCells(
            ((toDateCost / date_diff) * DAYS_IN_YEARS).toFixed(2),
            "USD"
          )}
          {renderCells(
            ((toDateCarbon / date_diff) * DAYS_IN_YEARS).toFixed(2),
            "tCO2e"
          )}
        </tr>
        <tr>
          <th>Engagement</th>
          {renderCells(labs.size, "Labs")}
          {renderCells(availableAccounts.length, "Scientists")}
          <td></td>
        </tr>
        <tr>
          <th>Sashimi Network</th>
          {renderCells(availableSensors.length, "sensors")}
          {renderCells(summedDataValues.length, "datapoints")}
          {renderCells(numBuildings.size, "buildings")}
        </tr>
      </tbody>
    </Table>
  );
}

export default ImpactTable;
