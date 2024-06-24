// Header that is used by most pages

import { signOut } from 'aws-amplify/auth';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './Header.scss';

// Header to be used by all pages. Contains the page name and logout button
const Header = ({ pageName }) => {
  return (
    <Container className='p-0 m-0 Header'>
      <Row className='header-content'>
        <Col xs={10} className='header-title'>
          <h1> {pageName} </h1>
        </Col>
        <Col xs={2}>
          <Button
            variant='dark'
            className='logout-button'
            onClick={async () => await signOut().catch(err => console.warn(err))}
          >
            Log Out
          </Button>
        </Col>
      </Row>
      <hr />
    </Container>
  );
}

export default Header;
