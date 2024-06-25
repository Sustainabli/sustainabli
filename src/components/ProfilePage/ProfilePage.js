// Page that contains information about user. 
//    - USER and ORGANIZATION_ADMIN role can only see and edit basic information (e.g. name)
//    - SUPER_ADMIN can create organizations, create new fume hoods, and create new ORGANIZATION_ADMIN users
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import ProfileModalForm from './components/ProfileModalForm/ProfileModalForm';
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
  SUPER_ADMIN_ROLE,
  USER_ROLE,
} from '../../utils/Constants.js';
import { 
  userInfoSelector, 
  availableSensorInfoSelector,
  allOrganizationsSelector,
  allOrganizationAdminUsersSelector, 
} from "../../utils/Recoil";

import './ProfilePage.scss';

function ProfilePage() {
  const userInfo = useRecoilValue(userInfoSelector);
  const allOrganizations = useRecoilValue(allOrganizationsSelector);
  const allSensorsInfo = useRecoilValue(availableSensorInfoSelector);
  const allOrganizationAdminUsers = useRecoilValue(allOrganizationAdminUsersSelector);

  const [localAllOrganizations, setLocalAllOrganizations] = useState(allOrganizations);
  const [localAllSensorsInfo, setLocalAllSensorsInfo] = useState(allSensorsInfo);
  const [localAllOrganizationAdminUsers, setLocalAllOrganizationAdminUsers] = useState(allOrganizationAdminUsers);

  // For update modal forms
  const [selectedModalForm, setSelectedModalForm] = useState("");
  const [selectedOrganizationInfo, setSelectedOrganizationInfo] = useState(null);
  const [selectedSensorInfo, setSelectedSensorInfo] = useState(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);

  const closeModal = () => {
    setSelectedModalForm("");
    setSelectedOrganizationInfo(null);
    setSelectedSensorInfo(null);
    setSelectedUserInfo(null);
  }

  const renderShowModalButton = (formType, buttonText, userInfo=null, sensorInfo=null, organizationInfo=null) => {
    return (
      <Button
        className='showModalFormButton'
        variant='dark'
        onClick={() => {
          setSelectedModalForm(formType);
          setSelectedUserInfo(userInfo);
          setSelectedSensorInfo(sensorInfo);
          setSelectedOrganizationInfo(organizationInfo);
        }}
      >
        {buttonText}
      </Button>
    );
  }

  const isSuperAdmin = userInfo.role === SUPER_ADMIN_ROLE;
  const isUserRole = userInfo.role === USER_ROLE;
 
  // TODO: add table headers for each of the tables
  return (
    <Container fluid className='ProfilePage'>
      {selectedModalForm &&
        <ProfileModalForm
          formType={selectedModalForm}
          selectedOrganizationInfo={selectedOrganizationInfo}
          selectedSensorInfo={selectedSensorInfo}
          selectedUserInfo={selectedUserInfo}
          closeModal={closeModal}

          // Local state used by super admin
          localAllSensorsInfo={allOrganizations}
          localAllOrganizations={localAllOrganizations}

          // Callbacks for updating state
          setLocalAllOrganizations={setLocalAllOrganizations}
          setLocalAllSensorsInfo={setLocalAllSensorsInfo}
          setLocalAllOrganizationAdminUsers={setLocalAllOrganizationAdminUsers}
        />
      }
      <Header pageName='Profile' />
      <React.Fragment>
        {/* TODO: make UI prettier */}
        <Row className='profile-info'>
          <h2>Email: {userInfo.email}</h2>
          <h2>Name: {userInfo.name}</h2>
          <h2>Role: {userInfo.role}</h2>
          {!isSuperAdmin && <h2>Organization: {userInfo.organization_code}</h2>}
          {isUserRole && <h2>Group: {userInfo.group_name}</h2>}
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
                {localAllOrganizations.map((organization, index) => (
                  <tr key={index}>
                    <td>{organization.code}</td>
                    <td>{organization.name}</td>
                    <td className='button-cell'>
                      {renderShowModalButton(UPDATE_ORGANIZATION_INFO, 'Edit', null, null, organization)}
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
                {localAllSensorsInfo.map((sensor, index) => (
                  <tr key={index}>
                    <td>{sensor.organization_code}</td>
                    <td>{sensor.sensor_id}</td>
                    <td className='button-cell'>
                      {renderShowModalButton(UPDATE_SENSOR_INFO, 'Edit', null, sensor, null)}
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
                {localAllOrganizationAdminUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.email}</td>
                    <td>{user.organization_code}</td>
                    <td className='button-cell'>
                      {renderShowModalButton(UPDATE_ORGANIZATION_ADMIN_INFO, 'Edit', user, null, null)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </React.Fragment>
        }
      </React.Fragment>
    </Container>
  );
}

export default ProfilePage;
