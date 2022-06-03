import React from 'react';
import Container from 'react-bootstrap/Container';
import './Header.scss';

class Header extends React.Component {
  render() {
    return (
      <Container fluid className="HomeHeader">
        <h1> Home </h1>
        <div>
          <span> Dashboard </span>
          <span> Sash Competition Rules </span>
        </div>
        <hr/>
      </Container>
    );
  }
}

export default Header;
