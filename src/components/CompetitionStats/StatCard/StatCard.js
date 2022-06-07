import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './StatCard.scss';

class StatCard extends React.Component {
  render() {
    const { title, stat, percentChange } = this.props;
    return (
      <Container fluid className="StatCard">
        <div>{title}</div>
        <br/>
        <h4>{stat}</h4>
        <br/>
        <div>{percentChange}% since last week</div>
      </Container>
    );
  }
}

export default StatCard;
