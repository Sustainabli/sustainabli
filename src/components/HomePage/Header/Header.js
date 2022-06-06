import React from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { AiOutlineHome } from 'react-icons/ai';
import './Header.scss';

class Header extends React.Component {
  render() {
    const { selectedTab, onChangeSelectedTab } = this.props;
    return (
      <Container fluid className="HomeHeader">
        <div className="header-content">
          <span className="header-title">
            <AiOutlineHome/>
            <h1> Home </h1>
          </span>
      {/*
          <Tabs
            activeKey={selectedTab}
            onSelect={onChangeSelectedTab}
          >
            <Tab eventKey="dashboard" title="Dashboard"></Tab>
            <Tab eventKey="rules" title="Sash Competition Rules"></Tab>
          </Tabs>
        */}
        </div>
        <hr/>
      </Container>
    );
  }
}

export default Header;
