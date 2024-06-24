import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import ModalForm from './components/ModalForm/ModalForm';
import Header from '../../utils/components/Header/Header';
import {
  // Form types
  ADD_ORGANIZATION_ADMIN,
  CREATE_ORGANIZATION,
  CREATE_SENSOR,
  UPDATE_ORGANIZATION_ADMIN_INFO,
  UPDATE_ORGANIZATION_INFO,
  UPDATE_SENSOR_INFO,

  // User Roles
  ORGANIZATION_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
  USER_ROLE,
} from '../../utils/Constants.js';
import {
  // fetchAllSensorInfo,
  // fetchGroupsInOrganization,
  // fetchOrganizationAdminUserInfo,
  // fetchOrganizations,
  // fetchUsersInOrganization,
} from '../../utils/Utils.js';

import './ProfilePage.scss';

// TODO make this functional and access userInfo via Recoil
class ProfilePage extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedModalForm: '',

      // For update modal forms
      selectedOrganizationInfo: null,
      selectedUserInfo: null,
      selectedGroupInfo: null,
      selectedSensorInfo: null,

      // States for super admin
      allOrganizations: [],
      allOrganizationAdminUsers: [],
      allSensors: [],

      // States for organization admin
      allGroupsInOrganization: [],
      allUsersInOrganization: [],
    }
  }

  componentDidMount = async () => {
    // if (userInfo) {
    //   const { organization_code, role } = userInfo;
    //   this.setState({
    //     // Super admin can create/delete organizations
    //     allOrganizations: role === SUPER_ADMIN_ROLE ? await fetchOrganizations() : [],
    //     // Super admin can add/remove sensors
    //     allSensors: role === SUPER_ADMIN_ROLE ? await fetchAllSensorInfo() : [],
    //     // Super admin can view list of organization admins
    //     allOrganizationAdminUsers: role === SUPER_ADMIN_ROLE ? await fetchOrganizationAdminUserInfo() : [],
    //
    //     // Organization admin can create/delete groups in his organization
    //     allGroupsInOrganization: role === ORGANIZATION_ADMIN_ROLE ? await fetchGroupsInOrganization(organization_code) : [],
    //     // Organization admin can manage users in his organization
    //     allUsersInOrganization: role === ORGANIZATION_ADMIN_ROLE ? await fetchUsersInOrganization(organization_code) : [],
    //   });
    // }
  }

  showModalForm = (formType, userInfo, groupInfo, sensorInfo, organizationInfo) => {
    this.setState({
      selectedModalForm: formType,
      selectedUserInfo: userInfo,
      selectedGroupInfo: groupInfo,
      selectedSensorInfo: sensorInfo,
      selectedOrganizationInfo: organizationInfo,
    });
  }

  clearModalFormType = () => {
    this.setState({
      selectedModalForm: '',
      selectedUserInfo: null,
      selectedGroupInfo: null,
      selectedSensorInfo: null,
      selectedOrganizationInfo: null,
    });
  }

  updateAllOrganizationsList = allOrganizations => {
    this.setState({
      allOrganizations: allOrganizations,
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

  renderShowModalButton = (formType, buttonText, userInfo=null, groupInfo=null, sensorInfo=null, organizationInfo=null) => {
    return (
      <Button
        className='showModalFormButton'
        variant='dark'
        onClick={() => this.showModalForm(formType, userInfo, groupInfo, sensorInfo, organizationInfo)}
      >
        {buttonText}
      </Button>
    );
  }

  render() {
    const {
      allSensors,
      allOrganizations,
      allGroupsInOrganization,
      selectedModalForm,
      allOrganizationAdminUsers,
      selectedUserInfo,
      selectedGroupInfo,
      selectedSensorInfo,
      selectedOrganizationInfo,
    } = this.state;
    const { userInfo } = this.props;

    const isSuperAdmin = userInfo && userInfo.role === SUPER_ADMIN_ROLE;
    const isUserRole = userInfo && userInfo.role === USER_ROLE;

    // TODO for all of the tables in this page, add columns for editing and deleting entries
    // TODO add table headers for each of the tables
    return (
      <Container fluid className='ProfilePage'>
        {/* { selectedModalForm && */}
        {/*   <ModalForm */}
        {/*     formType={selectedModalForm} */}
        {/*     userInfo={userInfo} */}
        {/*     selectedUserInfo={selectedUserInfo} */}
        {/*     selectedGroupInfo={selectedGroupInfo} */}
        {/*     selectedSensorInfo={selectedSensorInfo} */}
        {/*     selectedOrganizationInfo={selectedOrganizationInfo} */}
        {/*     clearModalFormType={this.clearModalFormType} */}
        {/**/}
        {/*     // States used by super admin */}
        {/*     allOrganizations={allOrganizations} */}
        {/**/}
        {/*     // States used by organization admin */}
        {/*     allGroupsInOrganization={allGroupsInOrganization} */}
        {/**/}
        {/*     // Callbacks used by super admin */}
        {/*     updateAllOrganizationsList={this.updateAllOrganizationsList} */}
        {/*     updateAllSensorsList={this.updateAllSensorsList} */}
        {/*     updateAllOrganizationAdminUsers={this.updateAllOrganizationAdminUsers} */}
        {/**/}
        {/*     // Callbacks used by organization admin */}
        {/*     updateAllGroupsInOrganization={this.updateAllGroupsInOrganization} */}
        {/*     updateAllUsersInOrganization={this.updateAllUsersInOrganization} */}
        {/*   /> */}
        {/* } */}
        <Header pageName='Profile' />
        { userInfo && userInfo.email ? (
          <React.Fragment>
            <Row className='profile-info'>
              <h2>Email: {userInfo.email}</h2>
              <h2>Name: {userInfo.name}</h2>
              <h2>Role: {userInfo.role}</h2>
              {!isSuperAdmin && <h2>Organization: {userInfo.organization_code}</h2>}
              {isUserRole && <h2>Group: {userInfo.group_name}</h2>}
              {/* TODO commonize the table creation code */}
            </Row>
            {isSuperAdmin &&
              <React.Fragment>
                <Row className='table-header'> <h3>Organizations</h3> </Row>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Organization Code</th>
                      <th>Name</th>
                      <th className='button-cell'>
                        {this.renderShowModalButton(CREATE_ORGANIZATION, 'Create New Organization')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrganizations.map((organization, index) => (
                      <tr key={index}>
                        <td>{organization.code}</td>
                        <td>{organization.name}</td>
                        <td className='button-cell'>
                          {this.renderShowModalButton(UPDATE_ORGANIZATION_INFO, 'Edit', null, null, null, organization)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Row className='table-header'> <h3>Sensors</h3> </Row>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Organization Code</th>
                      <th>Sensor ID/MAC Address</th>
                      <th className='button-cell'>
                        {this.renderShowModalButton(CREATE_SENSOR, 'Add New Sensor')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSensors.map((sensor, index) => (
                      <tr key={index}>
                        <td>{sensor.organization_code}</td>
                        <td>{sensor.id}</td>
                        <td className='button-cell'>
                          {this.renderShowModalButton(UPDATE_SENSOR_INFO, 'Edit', null, null, sensor, null)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Row className='table-header'> <h3>Organization Admins</h3> </Row>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Organization Code</th>
                      <th className='button-cell'>
                        {this.renderShowModalButton(ADD_ORGANIZATION_ADMIN, 'Add Organization Admin')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrganizationAdminUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{user.email}</td>
                        <td>{user.organization_code}</td>
                        <td className='button-cell'>
                          {this.renderShowModalButton(UPDATE_ORGANIZATION_ADMIN_INFO, 'Edit', user, null, null, null)}
                        </td>
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
          )}
      </Container>
    );
  }
}

export default ProfilePage;
