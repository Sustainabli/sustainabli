import React, { useEffect } from 'react';
import {
  useRecoilState,
} from 'recoil';
import { withAuth0 } from '@auth0/auth0-react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import DataQueryPage from './components/DataQueryPage/DataQueryPage';
import FumeHoodsPage from './components/FumeHoodsPage/FumeHoodsPage';
import LoginPage from './components/LoginPage/LoginPage';
import OrganizationPage from './components/OrganizationPage/OrganizationPage';
import OverviewPage from './components/OverviewPage/OverviewPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import TeamPage from './components/TeamPage/TeamPage';
import ShutTheSashPage from './components/ShutTheSashPage/ShutTheSashPage';
import NavSidebar from './utils/components/NavSidebar/NavSidebar';
import {
  // Recoil states
  AVAILABLE_SENSORS_STATE,
  USER_INFO_STATE,
  AVAILABLE_ACCOUNTS_STATE,

  // Webpage paths
  DATA_QUERY_PAGE_PATH,
  FUME_HOODS_PAGE_PATH,
  LOGIN_PAGE_PATH,
  ORGANIZATION_PAGE_PATH,
  OVERVIEW_PAGE_PATH,
  PROFILE_PAGE_PATH,
  SHUT_THE_SASH_PAGE_PATH,
  TEAM_PAGE_PATH,

  // Account roles
  ORGANIZATION_ADMIN_ROLE,
  USER_ROLE,
} from './utils/Constants';
import {
  addUserInfo,
  fetchUserInfo,
  fetchSensorInfoFromGroup,
  fetchSensorInfoFromOrganization,
  fetchUsersInOrganization,
} from './utils/Utils';

function App(props) {
  const { isAuthenticated, user } = props.auth0;
  const [availableSensors, setAvailableSensors] = useRecoilState(AVAILABLE_SENSORS_STATE);  // Available sensors to view metrics for the user
  const [userInfo, setUserInfo] = useRecoilState(USER_INFO_STATE);
  const [availableAccounts, setAvailableAccounts] = useRecoilState(AVAILABLE_ACCOUNTS_STATE);

  useEffect(() => {
    // Loads user and sensor data for user from database
    const loadData = async () => {
      let userInfo = await fetchUserInfo(user.email);

      // If there is no info on the user, then create an empty user_role account for them for the database
      if (Object.keys(userInfo).length === 0) {
        userInfo = await addUserInfo(user.email, user.name, USER_ROLE, '', '');
        return;
      }

      // Get available sensors depending on user account role
      let availableSensors = [];
      if (userInfo.role === USER_ROLE) {
        availableSensors = await fetchSensorInfoFromGroup(userInfo.organization_code, userInfo.group_name);
      } else if (userInfo.role === ORGANIZATION_ADMIN_ROLE) {
        availableSensors = await fetchSensorInfoFromOrganization(userInfo.organization_code);
        const availableAccounts = await fetchUsersInOrganization(userInfo.organization_code);
        setAvailableAccounts(availableAccounts);
      }

      setAvailableSensors(availableSensors);
      setUserInfo(userInfo);
    }

    // Need to wait for auth0 to authenticate user before we retrieve userInfo data from our database.
    // Do a null check on userInfo so we don't repeatedly fetch user info.
    // If fetching user info from the database yields an empty object (meaning the user isn't in our database yet), add the user into our database.
    // After the empty account is created, the user must be added to the organization by the organization admin.
    // The available sensors for a user to view are:
    //   - The sensors associated with the group the user belongs to for USER_ROLE
    //   - All sensors in the organization for ORGANIZATION_ADMIN_ROLE
    if (isAuthenticated && user && !userInfo ) {
      loadData();
    }
  }, [isAuthenticated, user, userInfo]);

    return (
      <Container fluid className='p-0 m-0 App'>
        {/* Show website content only if the user is logged in. Otherwise show the login page */}
        { isAuthenticated && user && userInfo ?
          <BrowserRouter>
              <Row className='p-0 m-0 root-row'>
                <Col sm={1} lg={2} className='p-0'>
                  <NavSidebar userInfo={userInfo}/>
                </Col>
                <Col sm={12} lg={10} className='p-0'>
                  <Routes>
                    { userInfo.role === ORGANIZATION_ADMIN_ROLE &&
                      <React.Fragment>
                        <Route
                          exact
                          path={ OVERVIEW_PAGE_PATH }
                          element={ <OverviewPage /> }
                        />
                      <Route
                        exact
                        path = { ORGANIZATION_PAGE_PATH }
                        element={ <OrganizationPage userInfo={ userInfo }/> }
                      />
                      <Route
                        exact
                        path = { FUME_HOODS_PAGE_PATH }
                        element={ <FumeHoodsPage availableSensors={availableSensors} updateSensors={setAvailableSensors}/> }
                      />
                      <Route
                        exact
                        path = { DATA_QUERY_PAGE_PATH }
                        element={ <DataQueryPage availableSensors={availableSensors} userInfo={userInfo} /> }
                      />
                      <Route
                        exact
                        path = { SHUT_THE_SASH_PAGE_PATH }
                        element={ <ShutTheSashPage /> }
                      />
                      </React.Fragment>
                    }
                    {/* TODO figure out if we need this
                    <Route
                      exact
                      path={ TEAM_PAGE_PATH }
                      element={ <TeamPage/> }
                    />
                    */}
                    <Route
                      exact
                      path={ PROFILE_PAGE_PATH }
                      element={ <ProfilePage userInfo={ userInfo }/> }
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
                path ={ LOGIN_PAGE_PATH }
                element={ <LoginPage /> }
              />
              <Route
                path='/*'
                element={ <Navigate to= {LOGIN_PAGE_PATH } /> }
              />
            </Routes>
          </BrowserRouter>
        }
      </Container>
    );
  // }
}

export default withAuth0(App);
