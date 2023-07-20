import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './LoginPage.scss';

const LoginPage = () => {
  const { isAuthenticated, loginWithPopup, logout } = useAuth0();
  return (
    <Container fluid className='p-0 m-0 LoginPage'>
        <Row className='text-center header'>
      	  <h1> Welcome to Sashimi </h1>
	  <h3> Manage your organization's fume hoods all in one place </h3>
	</Row>
        <Row className='justify-content-md-center blurb'>

	  Please login or create an account to access Sashimi services. Note that you must be added to an organization before you can view Sashimi data.
        </Row>
	<Row className='login-button'>
	  <Col className='col-md-12 text-center'>
	    <Button
	      className='login-button'
	      variant='dark'
	      onClick={() => isAuthenticated ? logout() : loginWithPopup() }
	    >
	      {isAuthenticated ? 'Log Out' : 'Log In or Create an Account'}
	    </Button>
	  </Col>
	</Row>
    </Container>
  );
}

export default LoginPage;
