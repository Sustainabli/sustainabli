import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { AiOutlineHome, AiOutlineTeam } from 'react-icons/ai';
import './Header.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useAuth0 } from '@auth0/auth0-react';

const Header = ({ pageName, selectedTab, onChangeSelectedTab }) => {
  const { isAuthenticated, loginWithPopup, logout } = useAuth0();
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
            <Button
              onClick={() => {
                isAuthenticated
                  ? logout()
                  : loginWithPopup();
              }}
            >
              {isAuthenticated ? 'Log Out' : 'Log In'}
            </Button>
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
};

export default Header;
