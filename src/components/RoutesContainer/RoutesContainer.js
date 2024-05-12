import { Fragment, useEffect } from 'react';
import { signOut } from 'aws-amplify/auth';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavSidebar from '../../utils/components/NavSidebar/NavSidebar';
import { addUserInfo, fetchSensorInfoFromGroup, fetchSensorInfoFromOrganization, fetchUserInfo, fetchUsersInOrganization } from '../../utils/Utils';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AVAILABLE_ACCOUNTS_STATE, AVAILABLE_SENSORS_STATE, DATA_QUERY_PAGE_PATH, FUME_HOODS_PAGE_PATH, ORGANIZATION_ADMIN_ROLE, ORGANIZATION_PAGE_PATH, OVERVIEW_PAGE_PATH, PROFILE_PAGE_PATH, SHUT_THE_SASH_PAGE_PATH, USER_INFO_STATE, USER_ROLE } from '../../utils/Constants';
import OverviewPage from '../OverviewPage/OverviewPage';
import OrganizationPage from '../OrganizationPage/OrganizationPage';
import FumeHoodsPage from '../FumeHoodsPage/FumeHoodsPage';
import DataQueryPage from '../DataQueryPage/DataQueryPage';
import ShutTheSashPage from '../ShutTheSashPage/ShutTheSashPage';
import ProfilePage from '../ProfilePage/ProfilePage';

function RoutesContainer(props) {
  const { amplifyUser } = props;

  const setAvailableAccounts = useSetRecoilState(AVAILABLE_ACCOUNTS_STATE);
  const [availableSensors, setAvailableSensors] = useRecoilState(AVAILABLE_SENSORS_STATE);  // Available sensors to view metrics for the user
  const [userInfo, setUserInfo] = useRecoilState(USER_INFO_STATE);

  useEffect(() => {
    const loadData = async () => {
      if (amplifyUser && userInfo === null) {
        const amplifyEmail = amplifyUser.loginId;
        let userInfo = await fetchUserInfo(amplifyEmail);

        // If there is no info on the user, then create an empty user_role account for them for the database
        if (Object.keys(userInfo).length === 0) {
          userInfo = await addUserInfo(amplifyEmail, '', USER_ROLE, '', '');
        } else {
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
        }
        setUserInfo(userInfo);
      }
    };

    loadData();
  }, [amplifyUser, setAvailableAccounts, setAvailableSensors, setUserInfo, userInfo]);

  return userInfo ?
      (
        <BrowserRouter>
          <Row className='p-0 m-0 root-row'>
            <Col sm={1} lg={2} className='p-0'>
              <NavSidebar userInfo={userInfo} />
            </Col>
            <Col sm={12} lg={10} className='p-0'>
              <Routes>
                {userInfo.role === ORGANIZATION_ADMIN_ROLE &&
                  <Fragment>
                    <Route
                      exact
                      path={OVERVIEW_PAGE_PATH}
                      element={<OverviewPage />}
                    />
                    <Route
                      exact
                      path={ORGANIZATION_PAGE_PATH}
                      element={<OrganizationPage />}
                    />
                    <Route
                      exact
                      path={FUME_HOODS_PAGE_PATH}
                      element={<FumeHoodsPage />}
                    />
                    <Route
                      exact
                      path={DATA_QUERY_PAGE_PATH}
                      element={<DataQueryPage availableSensors={availableSensors} userInfo={userInfo} />}
                    />
                    <Route
                      exact
                      path={SHUT_THE_SASH_PAGE_PATH}
                      element={<ShutTheSashPage />}
                    />
                  </Fragment>
                }
                <Route
                  exact
                  path={PROFILE_PAGE_PATH}
                  element={<ProfilePage userInfo={userInfo} />}
                />
                {/* TODO have this redirect to "/". This was causing useEffect errors for some reason */}
                <Route
                  path='/*'
                  element={<OverviewPage />}
                />
              </Routes>
            </Col>
          </Row>
        </BrowserRouter>
      )
    :
      (
        <Button
          variant='dark'
          className='logout-button'
          onClick={async () => await signOut().catch(err => console.warn(err))}
        >
          Log Out
        </Button>
      )
}

export default RoutesContainer;
