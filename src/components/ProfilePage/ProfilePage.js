import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Header from '../Header/Header';
import ModalForm from './components/ModalForm/ModalForm';
import {
  SUPER_ADMIN_ROLE,
  ORGANIZATION_ADMIN_ROLE,
  USER_ROLE ,
  CREATE_ORGANIZATION,
  CREATE_GROUP,
  CREATE_SENSOR,
  ADD_USER,
  ADD_ORGANIZATION_ADMIN,
} from '../../utils/Constants.js';
import {
  fetchOrganizations,
  fetchGroupsInOrganization,
  fetchAllUserEmails,
  fetchUsersInOrganization,
  fetchOrganizationAdminUserInfo,
  fetchSensorInfoFromOrganization,
  fetchAllSensorInfo,
} from '../../utils/Utils.js';

import './ProfilePage.scss';

class ProfilePage extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedModalForm: '',

      // States for super admin
      allOrganizations: [],
      allSensors: [],
      allOrganizationAdminUsers: [],
      allUserEmails: [],

      // States for organization admin
      allUsersInOrganization: [],
      allGroupsInOrganization: [],
      allSensorsInOrganization: [],
    }
  }

  componentDidMount = async () => {
    const { userInfo } = this.props;
    if (userInfo) {
      const {role, organizationCode } = userInfo;
      this.setState({
        userInfo,

        // Super admin can create/delete organizations
        allOrganizations: role === SUPER_ADMIN_ROLE ? await fetchOrganizations() : [],
        // Super admin can add/remove sensors
        allSensors: role === SUPER_ADMIN_ROLE ? await fetchAllSensorInfo() : [],
        // Super admin can view list of organization admins
        allOrganizationAdminUsers: role === SUPER_ADMIN_ROLE ? await fetchOrganizationAdminUserInfo() : [],
        // Super admin can assign the organization_admin role to users
        allUserEmails: role === SUPER_ADMIN_ROLE ? await fetchAllUserEmails() : [],

        // Organization admin can create/delete groups in his organization
        allGroupsInOrganization: role === ORGANIZATION_ADMIN_ROLE ? await fetchGroupsInOrganization({organization_code: organizationCode}) : [],
        // Organization admin can manage users in his organization
        allUsersInOrganization: role === ORGANIZATION_ADMIN_ROLE ? await fetchUsersInOrganization({organization_code: organizationCode}) : [],
        // Organizatino admin can view all sensors in his organization
        allSensorsInOrganization: role === ORGANIZATION_ADMIN_ROLE ? await fetchSensorInfoFromOrganization({organization_code: organizationCode}) : [],
      });
    }
  }

  showModalForm = formType => {
    this.setState({
      selectedModalForm: formType,
    });
  }

  clearModalFormType = () => {
    this.setState({
      selectedModalForm: '',
    });
  }

  updateAllOrganizationsList = allOrganizations => {
    this.setState({
      allOrganizations: allOrganizations,
    });
  }

  updateAllGroupsInOrganization = allGroupsInOrganization => {
    this.setState({
      allGroupsInOrganization: allGroupsInOrganization,
    });
  }

  updateAllUsersInOrganization = allUsersInOrganization => {
    this.setState({
      allUsersInOrganization: allUsersInOrganization,
    });
  }

  updateAllOrganizationAdminUsers = allOrganizationAdminUsers => {
    this.setState({
      allOrganizationAdminUsers: allOrganizationAdminUsers,
    });
  };

  updateAllSensorsList = allSensors => {
    this.setState({
      allSensors: allSensors,
    });
  }

  render() {
    const {
      allSensors,
      allOrganizations,
      allUsersInOrganization,
      allGroupsInOrganization,
      selectedModalForm,
      allSensorsInOrganization,
      allOrganizationAdminUsers,
      allUserEmails
    } = this.state;
    const { userInfo, auth0 } = this.props;
    const { isAuthenticated, user } = auth0;

    const isSuperAdmin = userInfo && userInfo.role === SUPER_ADMIN_ROLE;
    const isOrganizationAdmin = userInfo && userInfo.role === ORGANIZATION_ADMIN_ROLE;
    const isUserRole = userInfo && userInfo.role === USER_ROLE;

    // TODO for all of the tables in this page, add columns for editing and deleting entries
    // TODO add table headers for each of the tables
    return (
      <Container fluid className='ProfilePage'>
        { selectedModalForm &&
          <ModalForm
            formType={selectedModalForm}
            userInfo={userInfo}
            clearModalFormType={this.clearModalFormType}

            // States used by super admin
            allOrganizations={allOrganizations}
            allUserEmails={allUserEmails}

            // States used by organization admin
            allGroupsInOrganization={allGroupsInOrganization}
            allSensorsInOrganization={allSensorsInOrganization}

            // Callbacks used by super admin
            updateAllOrganizationsList={this.updateAllOrganizationsList}
            updateAllSensorsList={this.updateAllSensorsList}
            updateAllOrganizationAdminUsers={this.updateAllOrganizationAdminUsers}

            // Callbacks used by organization admin
            updateAllGroupsInOrganization={this.updateAllGroupsInOrganization}
            updateAllUsersInOrganization={this.updateAllUsersInOrganization}
          />
        }
        <Header pageName='Profile' />
        {isAuthenticated ? (
          userInfo && userInfo.email ? (
            <React.Fragment>
              <h2>{user.email}</h2>
              <h2>Role: {userInfo.role}</h2>
              {!isSuperAdmin && <h2>Organization: {userInfo.organizationCode}</h2>}
              {isUserRole && <h2>Group: {userInfo.groupName}</h2>}
              {isSuperAdmin &&
                <React.Fragment>
                  <Button
                    className='showModalFormButton'
                    onClick={() => this.showModalForm(CREATE_ORGANIZATION)}
                  >
                    Create New Organization
                  </Button>
                  <Table bordered hover striped>
                    <thead>
                      <tr>
                        <th>Organization Code</th>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrganizations.map((organization, index) => (
                        <tr key={index}>
                          <td>{organization.code}</td>
                          <td>{organization.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Button
                    className='showModalFormButton'
                    onClick={() => this.showModalForm(CREATE_SENSOR)}
                  >
                    Add New Sensor
                  </Button>
                  <Table bordered hover striped>
                    <thead>
                      <tr>
                        <th>Organization Code</th>
                        <th>Sensor ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSensors.map((sensor, index) => (
                        <tr key={index}>
                          <td>{sensor.organizationCode}</td>
                          <td>{sensor.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Button
                    className='showModalFormButton'
                    onClick={() => this.showModalForm(ADD_ORGANIZATION_ADMIN)}
                  >
                    Add Organization Admin
                  </Button>
                  <Table bordered hover striped>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Organization Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrganizationAdminUsers.map((user, index) => (
                        <tr key={index}>
                          <td>{user.email}</td>
                          <td>{user.organizationCode}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </React.Fragment>
              }
              {isOrganizationAdmin &&
                <React.Fragment>
                  <Button
                    className='showModalFormButton'
                    onClick={() => this.showModalForm(ADD_USER)}
                  >
                    Add User
                  </Button>
                  <Table bordered hover striped>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Group</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsersInOrganization.map((user, index) => (
                        <tr key={index}>
                          <td>{user.email}</td>
                          <td>{user.group_name}</td>
                          <td>{user.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Button
                    className='showModalFormButton'
                    onClick={() => this.showModalForm(CREATE_GROUP)}
                  >
                    Create New Group
                  </Button>
                  <Table bordered hover striped>
                    <thead>
                      <tr>
                        <th>Group Name</th>
                        <th>Fume Hoods</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* TODO display sensor.fumeHoodName, rather than sensor.id */}
                      {allGroupsInOrganization.map((group, index) => (
                        <tr key={index}>
                          <td>{group.name}</td>
                          <td>{group.sensors.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Table bordered hover striped>
                    <thead>
                      <tr>
                        <th>Sensor ID</th>
                        <th>Fume Hood Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSensorsInOrganization.map((sensor, index) => (
                        <tr key={index}>
                          <td>{sensor.id}</td>
                          <td>{sensor.fumeHoodName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </React.Fragment>
              }
            </React.Fragment>
          )
            :
            (<React.Fragment>
              User info not found. Please contact <a href='mailto: admin@sustainabli.us'>admin@sustainabli.us</a> for help.
            </React.Fragment>
            )
        )
          :
          (
            <React.Fragment>
              Please log in to view profile information.
            </React.Fragment>
          )}
      </Container>
    );
  }
}

export default withAuth0(ProfilePage);
