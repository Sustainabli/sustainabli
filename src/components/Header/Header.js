import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Header.scss';

const Header = ({ pageName }) => {
  const { isAuthenticated, loginWithPopup, logout } = useAuth0();
  return (
    <Container className='p-0 m-0 Header'>
        <Row className='header-content'>
          <Col xs={10} className='header-title'>
              <h1> {pageName} </h1>
          </Col>
          <Col xs={2}>
          {/* TODO once login page is configured, we will only need the logout button. If the user logs out, website will redirect to login page */}
            <Button
              className='login-button'
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
      <hr />
    </Container>
  );
}

export default Header;
