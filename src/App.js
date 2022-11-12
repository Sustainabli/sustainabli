import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DemoPage from './components/DemoPage/DemoPage';
import HomePage from './components/HomePage/HomePage';
import LabPage from './components/LabPage/LabPage';
import NavDrawer from './components/NavDrawer/NavDrawer';
import ProfilePage from './components/ProfilePage/ProfilePage';
import TeamPage from './components/TeamPage/TeamPage';
import { LAB_NAMES } from './utils/Constants';
import Admin from './components/Admin/Admin';

import './App.scss';

class App extends React.Component {
  render() {
  console.log('ASDFASDF', window.location.href);
    return (
      <Container className='App' fluid>
        <Row className='root-row'>
          <Col md={2} className='navdrawer-col'>
            <NavDrawer />
          </Col>
          <Col md={10} className='root-right-col'>
            <BrowserRouter>
              <Auth0Provider
                domain={process.env.REACT_APP_AUTH0_DOMAIN}
                clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
                redirectUri={window.location.href}
              >
                <Routes>
                  <Route exact path='/' element={<HomePage />} />
                  {LAB_NAMES.map(lab => (
                    <Route
                      exact
                      path={`/${lab}`}
                      element={<LabPage lab={lab} />}
                      key={lab}
                    />
                  ))}
                  <Route exact path='/team' element={<TeamPage />} />
                  <Route exact path='/demo' element={<DemoPage />} />
                  <Route path='/admin' element={<Admin />} />
                  <Route path='/profile' element={<ProfilePage />} />
                  <Route path='/*' element={<Navigate to='/' />} />
                </Routes>
              </Auth0Provider>
            </BrowserRouter>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
