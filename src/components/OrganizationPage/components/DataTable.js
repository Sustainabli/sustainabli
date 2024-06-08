import React from 'react';
import './DataTable.scss';

function toCssClass(text) {
  if (typeof text !== 'string') {
    return '';
  }
  return text.replace(/\s+/g, '-').toLowerCase();
}


const DataTable = ({ data }) => {
  console.log(data);
  return (
    <table className="DataTable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Lab</th>
          <th>Account Type</th>
          <th>Joined</th>
          <th>Preferred Hood</th>
          <th>Efficiency Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.name}</td>
            <td>{row.group_name}</td>
            <td>{row.role}</td>
            <td>{row.joined}</td>
            <td>{row.preferred_hood}</td>
            <td className={`efficiency-score ${toCssClass(row.efficiencyScore)}`}>
              {row.efficiency_score}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
