import React from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { AiOutlineHome, AiOutlineTeam } from 'react-icons/ai';
import './Header.scss';
import GoogleAuth from '../GoogleAuth/GoogleAuth';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Header extends React.Component {
  render() {
    const { pageName, selectedTab, onChangeSelectedTab } = this.props;
    return (
      <Container fluid className='Header'>
        <div className='header-content'>
          <Row>
            <Col md={10} className='left'>
              <span className='header-title'>
                {pageName === 'Home' && <AiOutlineHome />}
                {pageName === 'Our Team' && <AiOutlineTeam />}
                <h1> {pageName} </h1>
              </span>
            </Col>
            <Col md={2} className='right'>
              <span>
                <br />
                <GoogleAuth />
              </span>
            </Col>
          </Row>
          {pageName === 'Home' && (
            <Tabs activeKey={selectedTab} onSelect={onChangeSelectedTab}>
              <Tab eventKey='dashboard' title='Dashboard'></Tab>
              <Tab eventKey='rules' title='Sash Competition Rules'></Tab>
            </Tabs>
          )}
        </div>
        <hr />
      </Container>
    );
  }
}

export default Header;
