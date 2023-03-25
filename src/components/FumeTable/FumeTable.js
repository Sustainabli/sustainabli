import React from 'react';
import Table from 'react-bootstrap/Table';
import ProgressBar from 'react-bootstrap/ProgressBar';

import './FumeTable.scss';

import {
    extractFumehoodName
} from '../../utils/Utils.js';

class FumeTable extends React.Component {
    render() {
        const { data, name } = this.props;
        let labels = []
        let normalizedCFMs = []
        for (const [key, value] of Object.entries(data)) {
            labels.push({
                fumeHood: key,
                cfm: value[0].value,
                normalizedCFM: value[0].value
            })
            normalizedCFMs.push(value[0].value)
            //   labels.push(formatDateLabel(new Date(entry.time), TIME_GRANULARITIES.day))
        }
        var ratio = Math.max.apply(Math, normalizedCFMs) / 100
        for (var i = 0; i < normalizedCFMs.length; i++) {
            labels[i].normalizedCFM = Math.round(normalizedCFMs[i] / ratio)
        }

        console.log(labels)
        labels.sort((a, b) => {
            if (a.normalizedCFM < b.normalizedCFM) {
                return 1
            } else if (a.normalizedCFM > b.normalizedCFM) {
                return -1
            }
            return 0
        })
        console.log(labels)
        return (
            <Table>
                <thead>
                    <tr>
                        <th>{name} </th>
                        <th>CFM</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {labels.map((entry, index) => (
                        <tr key={index}>
                            {name == "Fume Hood" && <td>{extractFumehoodName(entry.fumeHood)}</td>}
                            {name == "Lab" && <td>{entry.fumeHood}</td>}
                            <td>{entry.cfm ? entry.cfm.toFixed(2) : "N/A"}</td>
                            <td><ProgressBar variant="info" now={entry.normalizedCFM} /></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    }
}

export default FumeTable;