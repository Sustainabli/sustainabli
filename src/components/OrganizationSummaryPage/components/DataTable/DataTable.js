import React from 'react';

function toCssClass(text) {
    return text.replace(/\s+/g, '-').toLowerCase();
  }

const DataTable = ({ data }) => {
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
            <td>{row.lab}</td>
            <td>{row.accountType}</td>
            <td>{row.joined}</td>
            <td>{row.preferredHood}</td>
            <td className={`efficiency-score ${toCssClass(row.efficiencyScore)}`}>
                {row.efficiencyScore}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
