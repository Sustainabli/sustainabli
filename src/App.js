import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DemoPage from './components/DemoPage/DemoPage';
import LabPage from './components/LabPage/LabPage';
import MetricsPage from './components/MetricsPage/MetricsPage';
import NavSidebar from './components/NavSidebar/NavSidebar';
import ProfilePage from './components/ProfilePage/ProfilePage';
import TeamPage from './components/TeamPage/TeamPage';
import { LAB_NAMES, HOME_PAGE_PATH, TEAM_PAGE_PATH } from './utils/Constants';
import Admin from "./components/Admin/Admin";

class App extends React.Component {
  render() {
    return (
      <Container className='p-0 m-0 App'>
        <BrowserRouter>
          <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
            redirectUri={window.location.href}
          >
            <Row className='p-0 root-row'>
              <Col sm={1} lg={2} className='p-0'>
                <NavSidebar />
              </Col>
              <Col sm={12} lg={10} className='p-0'>
                <Routes>
                  <Route exact path={HOME_PAGE_PATH} element={<MetricsPage />} />
                  {LAB_NAMES.map((lab) => (
                    <Route
                      exact
                      path={`/${lab}`}
                      element={<LabPage lab={lab} />}
                      key={lab}
                    />
                  ))}
                  {/* <Route exact path='/metrics' element={<MetricsPage />} /> */}
                  <Route exact path='/team' element={<TeamPage />} />
                  <Route exact path={TEAM_PAGE_PATH} element={<DemoPage />} />
                  <Route path='/admin' element={<Admin />} />
                  <Route path='/profile' element={<ProfilePage />} />
                  <Route path='/*' element={<Navigate to='/' />} />
                </Routes>
              </Col>
            </Row>
          </Auth0Provider>
        </BrowserRouter>
      </Container>
    );
  }
}

export default App;
