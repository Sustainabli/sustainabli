import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';
import { METRIC_TYPE_AIRFLOW } from '../../../../utils/Constants';
import { convertSashHeightToMetricValue } from '../../../../utils/Utils';

import './FumeTable.scss';

class FumeTable extends React.Component {
  render() {
    const { data, isGroup } = this.props;

    // Store an object of {fumeHoodName, summed cfm data} key value pairs
    const summedCfmData = {};
    data.forEach(datum => Object.entries(datum.data).forEach(([key, value]) => {
      const cfmValue = convertSashHeightToMetricValue(METRIC_TYPE_AIRFLOW, value);
      summedCfmData[key] = key in summedCfmData ? summedCfmData[key] + cfmValue : cfmValue;
    }));

    // Take the largest cfm value, calculate the ratio for the progress bar, and sort summedCfmData in descending order based on this ratio
    const ratio = Math.max.apply(Math, Object.values(summedCfmData)) / 100;
    const orderedSummedCfmData = Object.entries(summedCfmData).map(([key, value]) => ({
      fumeHood: key,
      cfm: value,
      normalizedCfm: Math.round(value / ratio)
    }));
    orderedSummedCfmData.sort((a, b) => b.normalizedCfm - a.normalizedCfm);

    return (
      <Table bordered hover className='FumeTable'>
        <thead>
          <tr>
            <th>{isGroup ? 'Groups' : 'Fume Hood'}</th>
            <th>CFM</th>
          </tr>
        </thead>
        <tbody>
          {orderedSummedCfmData.map((datum, index) => (
            <tr key={index}>
              <td>{datum.fumeHood}</td>
              <td>{datum.cfm ? datum.cfm.toFixed(2) : 'N/A'}</td>
              {/* Unable to set progress bar to 25% of table width through scss so doing inline styling instead */}
              <td style={{width: '25%'}}>
                <ProgressBar variant='info' now={datum.normalizedCfm}/>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default FumeTable;
