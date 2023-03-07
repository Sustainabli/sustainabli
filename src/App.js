import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MetricsPage from './components/MetricsPage/MetricsPage';
import NavSidebar from './components/NavSidebar/NavSidebar';
import ProfilePage from './components/ProfilePage/ProfilePage';
import TeamPage from './components/TeamPage/TeamPage';
import {
  HOME_PAGE_PATH,
  PROFILE_PAGE_PATH,
  TEAM_PAGE_PATH,
  USER_ROLE
} from './utils/Constants';
import {
  addUserInfo,
  fetchUserInfo,
  fetchSensorInfoFromGroup,
} from './utils/Utils';

// TODO create a login page. User should not be able to access any pages until he has logged in
// After user logins, two scenarios will occur
//  - User hasn't been added to an organization. In the case display a message saying the user to ask the organization admin to add him/her to the organization
//  - User has already been added to an organization, in which case he/she can navigate to the website pages as normal
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
    // If aftering fetcher using info from the database yields an empty object (meaning the user isn't in our database yet), add the user into our database
    // The available sensors for a user to view are the sensors associated with the group the user belongs to
    if (isAuthenticated && user) {
      if (!userInfo) {
        console.log(user);
        let userInfo = await fetchUserInfo({email: user.email});
        console.log(userInfo);
        if (Object.keys(userInfo).length === 0) {
          console.log('creating user');
          const reqBody = {
            email: user.email,
            name: user.name,
            role: USER_ROLE,
            organization_code: '',
            group_name: '',
          }
          userInfo = await addUserInfo(reqBody);
        }
        this.setState({
          userInfo: userInfo,
          availableSensors: await fetchSensorInfoFromGroup({group_name: userInfo.groupName}),
        })
      }
    }
  }

  render() {
    const { userInfo, availableSensors } = this.state;
    return (
      <Container className='p-0 m-0 App'>
        <BrowserRouter>
            <Row className='p-0 root-row'>
              <Col sm={1} lg={2} className='p-0'>
                <NavSidebar />
              </Col>
              <Col sm={12} lg={10} className='p-0'>
                <Routes>
                  <Route
                    exact
                    path={HOME_PAGE_PATH}
                    element={<MetricsPage availableSensors={availableSensors}/>}
                  />
                  <Route
                    exact
                    path={TEAM_PAGE_PATH}
                    element={<TeamPage />}
                  />
                  <Route
                    exact
                    path={PROFILE_PAGE_PATH}
                    element={<ProfilePage userInfo={userInfo}/>}
                  />
                  <Route
                    path='/*'
                    element={<Navigate to='/' />}
                  />
                </Routes>
              </Col>
            </Row>
        </BrowserRouter>
      </Container>
    );
  }
}

export default withAuth0(App);
