import React from 'react';
import Container from 'react-bootstrap/Container';
import './Rankings.scss';

class Rankings extends React.Component {
  render() {
    const { barGraphData, barGraphLabels } = this.props;
    const weekKeys = Object.keys(barGraphData);
    const currWeekKey = weekKeys[weekKeys.length - 1];

    console.log(barGraphData.beginning, barGraphData[currWeekKey]);
    const percentChangeList = barGraphData.beginning.map((datum, index) => (datum - barGraphData[currWeekKey][index]) / datum);
    const sortedPercentChangeIndices = Array.from(Array(percentChangeList.length).keys()).sort((a, b) => percentChangeList[a] < percentChangeList[b] ? -1 : (percentChangeList[b] < percentChangeList[a]) | 0);
    const mostImprovedRankings = [];
    for (let i = 1; i <= 3; i++) {
      const datumIndex = sortedPercentChangeIndices.findIndex(index => index === percentChangeList.length - i);
      mostImprovedRankings.push(`${barGraphLabels[datumIndex]} - ${(percentChangeList[datumIndex] * 100).toFixed(2)}% reduction`);
    }

    const sortedAvgs = [...barGraphData[currWeekKey]].sort();
    console.log(sortedAvgs);
    const lowestAvgRankings = sortedAvgs.slice(0, 3).map(avg => {
      const labelIndex = Object.keys(barGraphData[currWeekKey]).find(key => barGraphData[currWeekKey][key] === avg);
      return `${barGraphLabels[labelIndex]} - ${avg}`;
    });

    return (
      <Container fluid className="Rankings">
        <h3>Current Rankings</h3>
        <h4>Most Improved</h4>
        <ol>
          {mostImprovedRankings.map(rank =>
            <li className="ranking-text" key={rank}>{rank}</li>)
          }
        </ol>
        <h4>Lowest Avg. CFM</h4>
        <ol>
          {lowestAvgRankings.map(rank =>
            <li className="ranking-text" key={rank}>{rank}</li>)
          }
        </ol>
      </Container>
    );
  }
}

export default Rankings;
