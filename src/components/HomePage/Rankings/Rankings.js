import React from 'react';
import Container from 'react-bootstrap/Container';
import './Rankings.scss';

class Rankings extends React.Component {
  render() {
    const { barGraphData, barGraphLabels } = this.props;
    const weekKeys = Object.keys(barGraphData);
    const currWeekKey = weekKeys[weekKeys.length - 1];

    const percentChangeList = barGraphData.beginning.map((datum, index) => ({
      lab: barGraphLabels[index],
      stat: (datum - barGraphData[currWeekKey][index]) / datum,
    }));
    percentChangeList.sort((a, b) => b.stat - a.stat);
    const mostImprovedRankings = [];
    for (let i = 0; i < 3; i++) {
      mostImprovedRankings.push(`${percentChangeList[i].lab} - ${(percentChangeList[i].stat * 100).toFixed(2)}% reduction`);
    }

    const sortedAvgs = [...barGraphData[currWeekKey]].sort();
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
