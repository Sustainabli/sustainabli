import Container from 'react-bootstrap/Container';
import { withAuth0 } from '@auth0/auth0-react';
import Header from '../../utils/components/Header/Header';

function ShutTheSashPage() {
  return (
    <Container  className='ShutTheSashPage' fluid>
      <Header pageName='Shut the Sash Page' />
    </Container>
  );
}

export default withAuth0(ShutTheSashPage);
