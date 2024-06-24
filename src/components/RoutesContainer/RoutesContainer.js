// Handles routing of the app and managing what pages which user roles have access to
//    - For users that do not belong to an organization, they will see a "Please contact" UI. Users must belong to an organization to view any data
//    - There is also a potential bug where the user is logged via amplify but we aren't receiving any userInfo from the database. In this case, we show a logout button

import { 
  Fragment, 
  useEffect 
} from 'react';
import { 
  useRecoilValue, 
  useSetRecoilState 
} from 'recoil';
import { signOut } from 'aws-amplify/auth';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { 
  BrowserRouter, 
  Route, 
  Routes 
} from 'react-router-dom';
import OverviewPage from '../OverviewPage/OverviewPage';
import OrganizationPage from '../OrganizationPage/OrganizationPage';
import FumeHoodsPage from '../FumeHoodsPage/FumeHoodsPage';
import DataQueryPage from '../DataQueryPage/DataQueryPage';
import ShutTheSashPage from '../ShutTheSashPage/ShutTheSashPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import NavSidebar from '../../utils/components/NavSidebar/NavSidebar';
import { 
  // User Roles
  ORGANIZATION_ADMIN_ROLE, 
  USER_ROLE,

  // Page paths
  OVERVIEW_PAGE_PATH, 
  ORGANIZATION_PAGE_PATH, 
  FUME_HOODS_PAGE_PATH, 
  DATA_QUERY_PAGE_PATH, 
  SHUT_THE_SASH_PAGE_PATH,
  PROFILE_PAGE_PATH, 
} from '../../utils/Constants';
import { 
  amplifyEmailState, 
  userInfoSelector, 
} from '../../utils/Recoil';

function RoutesContainer(props) {
  const { amplifyUser } = props;

  const setAmplifyEmail = useSetRecoilState(amplifyEmailState);
  const userInfo = useRecoilValue(userInfoSelector);

  // Default page user will navigate to depending his role
  const defaultComponent = userInfo && userInfo.role === USER_ROLE ? <DataQueryPage /> : <OverviewPage />;

  useEffect(() => {
    if (amplifyUser) {
      setAmplifyEmail(amplifyUser.loginId);
    } 
  }, [amplifyUser, setAmplifyEmail]);

  const renderContent = () => {
    if (userInfo) {
      if (userInfo.organization_code) {
        return (
          <BrowserRouter>
            <Row className='p-0 m-0 root-row'>
              <Col sm={1} lg={2} className='p-0'>
                <NavSidebar />
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
                    </Fragment>
                  }
                  <Route
                    exact
                    path={DATA_QUERY_PAGE_PATH}
                    element={<DataQueryPage />}
                  />
                  <Route
                    exact
                    path={SHUT_THE_SASH_PAGE_PATH}
                    element={<ShutTheSashPage />}
                  />
                  <Route
                    exact
                    path={PROFILE_PAGE_PATH}
                    element={<ProfilePage userInfo={userInfo} />}
                  />
                  {/* TODO figure out Navigate is causing maximum stack depth */}
                  <Route 
                    path='/*'
                    element={defaultComponent} />
                </Routes>
              </Col>
            </Row>
          </BrowserRouter>
        );
      }
    // TODO:Create UI for user not in organization
      return (
        <Row>
          Please contact your organization admin to add you to an organization and a group. You will not be able to view data until you are a part of an organization and a group.
        </Row>
      );
    }
    // TODO: Create log out UI 
    return (
      <Button
        variant='dark'
        className='logout-button'
        onClick={async () => await signOut().catch(err => console.warn(err))}
      >
        Log Out
      </Button>
    );
  }

  return renderContent();
}

export default RoutesContainer;
