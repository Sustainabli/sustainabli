import React from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { AiOutlineHome, AiOutlineTeam } from 'react-icons/ai';
import './Header.scss';

class Header extends React.Component {
  render() {
    const { pageName, selectedTab, onChangeSelectedTab } = this.props;
    return (
      <Container fluid className='Header'>
        <div className='header-content'>
          <span className='header-title'>
            {pageName === 'Home' && <AiOutlineHome />}
            {pageName === 'Our Team' && <AiOutlineTeam />}
            <h1> {pageName} </h1>
          </span>
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
