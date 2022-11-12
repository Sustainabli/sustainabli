import React from 'react';
import Container from 'react-bootstrap/Container';
import { useAuth0 } from '@auth0/auth0-react';
import Header from '../Header/Header';

function ProfilePage() {
  const { isAuthenticated, user, isLoading } = useAuth0();

  console.log(isLoading, user, isAuthenticated);

  return (
    <Container fluid className='ProfilePage'>
      <Header pageName='Profile' />
      {isAuthenticated && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}
    </Container>
  );
}

export default ProfilePage;
