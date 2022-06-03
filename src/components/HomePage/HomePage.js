import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from './Header/Header';
import './HomePage.scss';

class HomePage extends React.Component {
  render() {
    return (
      <Container fluid className="HomePage">
        <Header/>
        <Row>
          <Col md={6}>
            Asdf
          </Col>
          <Col md={6}>
            Asdf
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            Asdf
          </Col>
          <Col md={3}>
            Asdf
          </Col>
        </Row>
      </Container>
    );
  }
}

export default HomePage;
