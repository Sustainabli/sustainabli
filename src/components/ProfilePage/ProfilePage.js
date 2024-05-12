import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
  UPDATE_USER_INFO,

  // User Roles
  ORGANIZATION_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
  USER_ROLE,
  USER_INFO_STATE,
} from '../../utils/Constants.js';
import {
  fetchAllSensorInfo,
  fetchGroupsInOrganization,
  fetchOrganizationAdminUserInfo,
  fetchOrganizations,
  fetchUsersInOrganization,
} from '../../utils/Utils.js';

import './ProfilePage.scss';
import { useRecoilState } from 'recoil';

function ProfilePage() {
  const [selectedModalForm, setSelectedModalForm] = useState('')
  const [selectedOrganizationInfo, setSelectedOrganizationInfo] = useState(null)
  const [selectedUserInfo, setSelectedUserInfo] = useState(null)
  const [selectedGroupInfo, setSelectedGroupInfo] = useState(null)
  const [selectedSensorInfo, setSelectedSensorInfo] = useState(null)
  const [allOrganizations, setAllOrganizations] = useState([])
  const [allOrganizationAdminUsers, setAllOrganizationAdminUsers] = useState([])
  const [allSensors, setAllSensors] = useState([])
  const [allGroupsInOrganization, setAllGroupsInOrganization] = useState([])
  const [allUsersInOrganization, setAllUsersInOrganization] = useState([])

  const [userInfo, setUserInfo] = useRecoilState(USER_INFO_STATE)

  useEffect(() => {
    async function fetchData() {
      const { organization_code, role } = userInfo;
      // Super admin can create/delete organizations
      if (role === SUPER_ADMIN_ROLE) setAllOrganizations(await fetchOrganizations())
      // Super admin can add/remove sensors
      if (role === SUPER_ADMIN_ROLE) setAllSensors(fetchAllSensorInfo())
      // Super admin can view list of organization admins
      if (role === SUPER_ADMIN_ROLE) setAllOrganizationAdminUsers(fetchOrganizationAdminUserInfo())

      // Organization admin can create/delete groups in his organization
      if (role === ORGANIZATION_ADMIN_ROLE) setAllGroupsInOrganization(fetchGroupsInOrganization(organization_code))
      // Organization admin can manage users in his organization
      if (role === ORGANIZATION_ADMIN_ROLE) setAllUsersInOrganization(fetchUsersInOrganization(organization_code))
    }
    if (userInfo) {
      fetchData()
    }
  }, [userInfo])

  const showModalForm = (formType, userInfo, groupInfo, sensorInfo, organizationInfo) => {
    setSelectedModalForm(formType)
    setSelectedUserInfo(userInfo)
    setSelectedGroupInfo(groupInfo)
    setSelectedSensorInfo(sensorInfo)
    setSelectedOrganizationInfo(organizationInfo)
  }

  const clearModalFormType = () => {
    setSelectedModalForm('')
    setSelectedUserInfo(null)
    setSelectedGroupInfo(null)
    setSelectedSensorInfo(null)
    setSelectedOrganizationInfo(null)
  }

  const updateAllOrganizationsList = allOrganizations => {
    setAllOrganizations(allOrganizations)
  }

  const updateAllOrganizationAdminUsers = allOrganizationAdminUsers => {
    setAllOrganizationAdminUsers(allOrganizationAdminUsers)
  };

  const updateAllSensorsList = allSensors => {
    setAllSensors(allSensors)
  }

  const updateAllGroupsInOrganization = allGroupsInOrganization => {
    setAllGroupsInOrganization(allGroupsInOrganization)
  }

  const updateAllUsersInOrganization = allUsersInOrganization => {
    setAllUsersInOrganization(allUsersInOrganization)
  }

  const renderShowModalButton = (formType, buttonText, userInfo=null, groupInfo=null, sensorInfo=null, organizationInfo=null) => {
    return (
      <Button
        className='showModalFormButton'
        variant='dark'
        onClick={() => showModalForm(formType, userInfo, groupInfo, sensorInfo, organizationInfo)}
      >
        {buttonText}
      </Button>
    );
  }

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
          selectedUserInfo={selectedUserInfo}
          selectedGroupInfo={selectedGroupInfo}
          selectedSensorInfo={selectedSensorInfo}
          selectedOrganizationInfo={selectedOrganizationInfo}
          clearModalFormType={clearModalFormType}

          // States used by super admin
          allOrganizations={allOrganizations}

          // States used by organization admin
          allGroupsInOrganization={allGroupsInOrganization}

          // Callbacks used by super admin
          updateAllOrganizationsList={updateAllOrganizationsList}
          updateAllSensorsList={updateAllSensorsList}
          updateAllOrganizationAdminUsers={updateAllOrganizationAdminUsers}

          // Callbacks used by organization admin
          updateAllGroupsInOrganization={updateAllGroupsInOrganization}
          updateAllUsersInOrganization={updateAllUsersInOrganization}

          updateAllFumeHoodsInOrganizationList={null}
          allFumeHoodsInOrganization={[]}
        />
      }
      <Header pageName='Account' />
      { userInfo && userInfo.email ? (
          <Container fluid>
            <React.Fragment>
              <Row className='profile-info d-inline-flex flex-row'>
                <h2>Account Information</h2>
                <Col className='py-3 px-5'>
                  <h2>Name: {userInfo.name}</h2>
                  <h2>Email: {userInfo.email}</h2>
                  <h2>Group: {userInfo.group_name}</h2>
                  {!isSuperAdmin && <h2>Organization: {userInfo.organization_code}</h2>}
                  <h2>Role: {userInfo.role}</h2>              
                  <h2 className='button-cell'>{renderShowModalButton(UPDATE_USER_INFO, 'Edit Information', userInfo, null, null, null)}</h2>
                </Col>
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
                          {renderShowModalButton(CREATE_ORGANIZATION, 'Create New Organization')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrganizations.map((organization, index) => (
                        <tr key={index}>
                          <td>{organization.code}</td>
                          <td>{organization.name}</td>
                          <td className='button-cell'>
                            {renderShowModalButton(UPDATE_ORGANIZATION_INFO, 'Edit', null, null, null, organization)}
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
                          {renderShowModalButton(CREATE_SENSOR, 'Add New Sensor')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSensors.map((sensor, index) => (
                        <tr key={index}>
                          <td>{sensor.organization_code}</td>
                          <td>{sensor.id}</td>
                          <td className='button-cell'>
                            {renderShowModalButton(UPDATE_SENSOR_INFO, 'Edit', null, null, sensor, null)}
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
                          {renderShowModalButton(ADD_ORGANIZATION_ADMIN, 'Add Organization Admin')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrganizationAdminUsers.map((user, index) => (
                        <tr key={index}>
                          <td>{user.email}</td>
                          <td>{user.organization_code}</td>
                          <td className='button-cell'>
                            {renderShowModalButton(UPDATE_ORGANIZATION_ADMIN_INFO, 'Edit', user, null, null, null)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </React.Fragment>
              }=
            </React.Fragment>
          </Container>
        )
          :
          (<React.Fragment>
            User info not found. Please contact <a href='mailto: admin@sustainabli.us'>admin@sustainabli.us</a> for help.
          </React.Fragment>
          )}
      </Container>
  );
  
}

export default ProfilePage;
