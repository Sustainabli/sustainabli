import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import MetricsPage from './components/MetricsPage/MetricsPage';
import NavSidebar from './components/NavSidebar/NavSidebar';
import OrganizationSummaryPage from './components/OrganizationSummaryPage/OrganizationSummaryPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import TeamPage from './components/TeamPage/TeamPage';
import {
  // Webpage paths
  HOME_PAGE_PATH,
  LOGIN_PAGE_PATH,
  PROFILE_PAGE_PATH,
  SUMMARY_PAGE_PATH,
  TEAM_PAGE_PATH,

  // Account roles
  ORGANIZATION_ADMIN_ROLE,
  USER_ROLE
} from './utils/Constants';
import {
  addUserInfo,
  fetchUserInfo,
  fetchSensorInfoFromGroup,
  fetchSensorInfoFromOrganization,
} from './utils/Utils';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      availableSensors: [],   // Available sensors to view metrics for
      userInfo: null,
    }
  }

  async componentDidUpdate() {
    const { isAuthenticated, user } = this.props.auth0;
    const { userInfo } = this.state;
    // Need to wait for auth0 to authenticate user before we retrieve userInfo data from our database
    // Do a null check on userInfo so we don't repeatedly fetch user info
    // If fetching user info from the database yields an empty object (meaning the user isn't in our database yet), add the user into our database. After the empty account is created, the user must be added to the organization by the organization admin
    // The available sensors for a user to view are the sensors associated with the group the user belongs to
    if (isAuthenticated && user && !userInfo) {
      let userInfo = await fetchUserInfo({ email: user.email });
      if (Object.keys(userInfo).length === 0) {
        userInfo = await addUserInfo(user.email, user.name, USER_ROLE, '', '');
      }
      let availableSensors = [];
      if (userInfo.role === USER_ROLE) {
        availableSensors = await fetchSensorInfoFromGroup(userInfo.organization_code, userInfo.group_name);
      } else if (userInfo.role === ORGANIZATION_ADMIN_ROLE) {
        availableSensors = await fetchSensorInfoFromOrganization(userInfo.organization_code);
        // Get correct keyname
        availableSensors.forEach(sensor => {
          sensor['sensor_id'] = sensor['id'];
          delete sensor['id'];
        });
      }

      this.setState({
        availableSensors: availableSensors,
        userInfo: userInfo,
      });
    }
  }

  render() {
    const { isAuthenticated, user } = this.props.auth0;
    const { availableSensors, userInfo } = this.state;

    return (
      <Container fluid className='p-0 m-0 App'>
        { isAuthenticated && user ?
          <BrowserRouter>
              <Row className='p-0 m-0 root-row'>
                <Col sm={1} lg={2} className='p-0'>
                  <NavSidebar userInfo={userInfo}/>
                </Col>
                <Col sm={12} lg={10} className='p-0'>
                  <Routes>
                    <Route
                      exact
                      path={ HOME_PAGE_PATH }
                      element={ <MetricsPage availableSensors={availableSensors} userInfo={userInfo} /> }
                    />
                    <Route
                      exact
                      path={ TEAM_PAGE_PATH }
                      element={ <TeamPage/> }
                    />
                    <Route
                      exact
                      path={ PROFILE_PAGE_PATH }
                      element={ <ProfilePage userInfo={ userInfo }/> }
                    />
                    <Route
                      exact
                      path = { SUMMARY_PAGE_PATH }
                      element={ <OrganizationSummaryPage userInfo={ userInfo }/> }
                    />
                    <Route
                      path='/*'
                      element={ <Navigate to="/" /> }
                    />
                  </Routes>
                </Col>
              </Row>
          </BrowserRouter>
        :
          <BrowserRouter>
            <Routes>
              <Route
                exact
                path = { LOGIN_PAGE_PATH }
                element={ <LoginPage /> }
              />
              <Route
                path='/*'
                element={ <Navigate to="/login" /> }
              />
            </Routes>
          </BrowserRouter>
        }
      </Container>
    );
  }
}

export default withAuth0(App);
