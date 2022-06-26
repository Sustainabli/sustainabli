import React from 'react';
import Row from 'react-bootstrap/Row';
import './CompetitionRules.scss';

class CompetitionRules extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Row className='homepage-row'>
          <div className='competition-rules-title'>
            <h2>Competition Rules</h2>
          </div>
          <ol className='competition-rules-list'>
            <li>
              Monthly competition with goals for each lab established in terms
              of exhaust airflow averages (in cubic feet per minute).
            </li>
            <br />
            <li>
              Each lab has customized goal based on number of hoods, usage
              patterns, and exhaust airflow ranges. This allows for lab to lab
              comparisons despite differences in research habits and lab setups.
            </li>
            <br />
            <li>
              Real-time exhaust airflow readings for each lab are taken every 30
              minutes automatically through the building automation system
              (BMS). These points are used to track performance on a daily,
              weekly, and monthly basis.
            </li>
            <br />
            <li>
              Each month a pizza party is raffled off to one lab that met its
              goal for the previous month.
            </li>
          </ol>
        </Row>
      </React.Fragment>
    );
  }
}

export default CompetitionRules;
