import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'
import {
  // Modal form types
  ADD_ORGANIZATION_ADMIN,
  ADD_USER,
  CREATE_GROUP,
  CREATE_ORGANIZATION,
  CREATE_SENSOR,
  UPDATE_FUME_HOOD_INFO,
  UPDATE_GROUP_INFO,
  UPDATE_ORGANIZATION_ADMIN_INFO,
  UPDATE_ORGANIZATION_INFO,
  UPDATE_SENSOR_INFO,
  UPDATE_USER_INFO,
  UPDATE_FUME_HOOD_PAGE,
  CREATE_FUME_HOOD,

  // User roles
  ORGANIZATION_ADMIN_ROLE,
  USER_ROLE
} from '../../Constants';
import {
  addGroup,
  addOrganization,
  addSensor,
  deleteGroup,
  deleteOrganization,
  updateFumeHoodInfo,
  updateGroupInfo,
  updateOrganizationAdminInfo,
  updateOrganizationInfo,
  updateSensorInfo,
  updateUserInfo,
  updateUserRole,
} from '../../Utils';

class ModalForm extends React.Component {
  constructor() {
    super();
    this.state = {
      // Select states
      groupQuery: '',
      organizationCodeQuery: '',
      selectedSensors: [],
    }
  }

  componentDidMount = () => {
    const { selectedGroupInfo, selectedSensorInfo, selectedUserInfo } = this.props;
    if (selectedUserInfo !== null) {
      this.setState({
        groupQuery: selectedUserInfo.group_name,
        organizationCodeQuery: selectedUserInfo.organization_code
      });
    } else if (selectedSensorInfo !== null) {
      this.setState({
        organizationCodeQuery: selectedSensorInfo.organization_code
      });
    } else if (selectedGroupInfo != null) {
      this.setState({
        selectedSensors: selectedGroupInfo.sensor_infos
      });
    }
  }

  // Functions for managing select states
  onChangeSelectedGroup = selected => this.setState({groupQuery: selected.value});
  onChangeSelectedOrganizationCode = selected => this.setState({organizationCodeQuery: selected.value});
  onChangeSelectedSensors = options => this.setState({selectedSensors: options.map(option => ({id: option.value, fume_hood_name: option.label}))});

  onCloseModal = () => {
    const { clearModalFormType } = this.props;
    this.setState({
      groupQuery: '',
      organizationCodeQuery: '',
      selectedSensors: [],
    });
    clearModalFormType();
  }


  /** Functions for adding/updating organizations **/
  // Generic stuff we do when updating a organization
  updateOrganizationList = allOrganizations => {
    const { updateAllOrganizationsList } = this.props;

    updateAllOrganizationsList(allOrganizations);
  }

  onDeleteOrganization = async event => {
    event.preventDefault();
    const { selectedOrganizationInfo } = this.props;

    const result = await deleteOrganization(selectedOrganizationInfo.code)
    this.updateOrganizationList(result.organizations);
    this.updateSensorList(result.sensors);
    this.updateOrganizationAdminList(result.organization_admins);
    this.onCloseModal();
  }

  onSubmitAddNewOrganization = async event => {
    event.preventDefault();

    const organizationCode = event.target.elements.organizationCodeFormGroup.value;
    const organizationName = event.target.elements.organizationNameFormGroup.value;

    const allOrganizations = await addOrganization(organizationCode, organizationName);
    this.updateOrganizationList(allOrganizations);
    this.onCloseModal();
  }

  onSubmitUpdateOrganizationInfo = async event => {
    event.preventDefault();
    const { selectedOrganizationInfo } = this.props;

    const newOrganizationCode = event.target.elements.organizationCodeFormGroup.value;
    const newOrganizationName = event.target.elements.organizationNameFormGroup.value;

    const allOrganizations = await updateOrganizationInfo(newOrganizationCode, newOrganizationName,
        selectedOrganizationInfo.code);
    this.updateOrganizationList(allOrganizations);
    this.onCloseModal();
  }


  /** Functions for creating/updating groups **/
  // Generic stuff we do when updating a group
  updateGroupList = async allGroupsInOrganization => {
    const { updateAllGroupsInOrganization } = this.props;

    updateAllGroupsInOrganization(allGroupsInOrganization);
  }

  onSubmitCreateGroup = async event => {
    event.preventDefault();
    const { selectedSensors } = this.state;
    const { userInfo } = this.props;

    const groupName = event.target.elements.groupNameFormGroup.value;

    const allGroupsInOrganization = await addGroup(groupName, userInfo.organization_code, selectedSensors);
    this.updateGroupList(allGroupsInOrganization);
    this.onCloseModal();
  }

  onSubmitUpdateGroupInfo = async (event) => {
    event.preventDefault();
    const { selectedGroupInfo, userInfo } = this.props;
    const { selectedSensors } = this.state;

    const newGroupName = event.target.elements.groupNameFormGroup.value;

    const allGroupsInOrganization = await updateGroupInfo(newGroupName, selectedGroupInfo.group_name,
        userInfo.organization_code, selectedSensors);
    this.updateGroupList(allGroupsInOrganization);
    this.onCloseModal();
  }

  onRemoveGroupFromOrganization = async (event) => {
    event.preventDefault();
    const { selectedGroupInfo, userInfo } = this.props;

    const result = await deleteGroup(selectedGroupInfo.group_name, userInfo.organization_code);
    this.updateGroupList(result.groups);
    this.updateUserList(result.users);
    this.onCloseModal();
  }


  /** Functions for adding organization admins **/
  // Generic stuff we do when adding/updating an organization admin info
  updateOrganizationAdminList = async (allOrganizationAdminUsers) => {
    const { updateAllOrganizationAdminUsers } = this.props;

    updateAllOrganizationAdminUsers(allOrganizationAdminUsers);
  }

  onSubmitAddOrganizationAdmin = async (event) => {
    event.preventDefault();
    const { organizationCodeQuery } = this.state;

    const email = event.target.elements.userEmailFormGroup.value;

    const allOrganizationAdminUsers = await updateUserRole(email, ORGANIZATION_ADMIN_ROLE,
        organizationCodeQuery);
    this.updateOrganizationAdminList(allOrganizationAdminUsers);
    this.onCloseModal();
  }

  onSubmitUpdateOrganizationAdminInfo = async (event) => {
    event.preventDefault();
    const { selectedUserInfo } = this.props;
    const { organizationCodeQuery } = this.state;

    const newEmail = event.target.elements.userEmailFormGroup.value;

    // TODO check for not found email
    const allOrganizationAdminUsers = await updateOrganizationAdminInfo(newEmail,
        selectedUserInfo.email, '', organizationCodeQuery, ORGANIZATION_ADMIN_ROLE);
    this.updateOrganizationAdminList(allOrganizationAdminUsers);
    this.onCloseModal();
  }

  onRemoveOrganizationAdmin = async (event) => {
    event.preventDefault();
    const { selectedUserInfo } = this.props;

    const allOrganizationAdminUsers = await updateOrganizationAdminInfo(selectedUserInfo.email,
        selectedUserInfo.email, '', '', '');
    this.updateOrganizationAdminList(allOrganizationAdminUsers);
    this.onCloseModal();
  }


  /** Functions for adding/updating user info **/
  // Generic stuff we do when updating a user's info
  updateUserList = (allUsersInOrganization) => {
    const { updateAllUsersInOrganization } = this.props;

    updateAllUsersInOrganization(allUsersInOrganization);
  }

  updateUserInfoAndUpdateUserList = async (newEmail, oldEmail, newGroupName, organizationCode, role) => {
    const { userInfo } = this.props;

    const allUsersInOrganization = await updateUserInfo(newEmail, oldEmail, newGroupName,
        organizationCode, role, userInfo.organization_code);
    this.updateUserList(allUsersInOrganization);
  }

  onSubmitAddUserToOrganization = async (event) => {
    event.preventDefault();
    const { userInfo } = this.props;
    const { groupQuery } = this.state;

    const userEmail = event.target.elements.userEmailFormGroup.value;

    // TODO check for not found email
    this.updateUserInfoAndUpdateUserList(userEmail, userEmail, groupQuery,
        userInfo.organization_code, USER_ROLE);
    this.onCloseModal();
  }

  onSubmitUpdateUserInfo = async (event) => {
    event.preventDefault();
    const { selectedUserInfo } = this.props;
    const { groupQuery } = this.state;

    const newEmail = event.target.elements.userEmailFormGroup.value;

    // TODO check for not found email
    this.updateUserInfoAndUpdateUserList(newEmail, selectedUserInfo.email, groupQuery,
        selectedUserInfo.organization_code, selectedUserInfo.role);
    this.onCloseModal();
  }

  onRemoveUserFromOrganization = async (event) => {
    event.preventDefault();
    const { selectedUserInfo } = this.props;

    this.updateUserInfoAndUpdateUserList(selectedUserInfo.email, selectedUserInfo.email, '', '', '');
    this.onCloseModal();
  }


  /** Functions for adding/updating sensors (super admin perspective) **/
  // Generic stuff we do when updating a sensor
  updateSensorList =  async allSensors => {
    const { updateAllSensorsList } = this.props;

    updateAllSensorsList(allSensors);
  }

  onSubmitAddNewSensor = async event => {
    event.preventDefault();
    const { organizationCodeQuery } = this.state;

    const sensorId = event.target.elements.addNewSensorIdFormGroup.value;

    const allSensors = await addSensor(sensorId, organizationCodeQuery);
    this.updateSensorList(allSensors);
    this.onCloseModal();
  }

  onSubmitUpdateSensorInfo = async event => {
    event.preventDefault();
    const { selectedSensorInfo } = this.props;
    const { organizationCodeQuery } = this.state;

    const newSensorId = event.target.elements.sensorIdFormGroup.value;

    const allSensors = await updateSensorInfo(newSensorId, selectedSensorInfo.id, organizationCodeQuery);
    this.updateSensorList(allSensors);
    this.onCloseModal();
  }


  /** Functions for updating fume hoods (organization_admin perspective) **/
  onSubmitUpdateFumeHoodInfo = async event => {
    event.preventDefault();
    const { updateAllFumeHoodsInOrganizationList, updateAllGroupsInOrganization, clearModalFormType, selectedSensorInfo } = this.props;

    const fumeHoodName = event.target.elements.fumeHoodNameFormGroup.value;

    const result = await updateFumeHoodInfo(selectedSensorInfo.id, fumeHoodName, selectedSensorInfo.organization_code);
    updateAllFumeHoodsInOrganizationList(result.fume_hoods);
    updateAllGroupsInOrganization(result.groups);
    clearModalFormType();
  }


  renderFormContent = () => {
    const {
      allFumeHoodsInOrganization,
      allGroupsInOrganization,
      allOrganizations,
      formType,
      selectedGroupInfo,
      selectedSensorInfo,
      selectedOrganizationInfo,
      selectedUserInfo,
    } = this.props;

    let formTitle = '';
    let modalBody;
    // TODO put limit on form fields
    switch (formType) {
      case ADD_ORGANIZATION_ADMIN:
        formTitle = 'Add an Organization Admin';
        modalBody =
          <Form onSubmit={this.onSubmitAddOrganizationAdmin}>
            <Modal.Body>
              <Form.Group controlId='userEmailFormGroup'>
                <Form.Label>
                  <h5>Email</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Email'
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <h5>Organization Code</h5>
                </Form.Label>
                <Select
                  options={
                    allOrganizations.map(organization =>
                      ({value: organization.code, label: organization.code})
                    )
                  }
                  isMulti={false}
                  onChange={selected => this.onChangeSelectedOrganizationCode(selected)}
                  closeMenuOnSelect={true}
                />
              </Form.Group>
            <Modal.Footer>
              <Button variant='dark' type='submit'>
                Submit
              </Button>
            </Modal.Footer>
            </Modal.Body>
          </Form>
        break;
      case ADD_USER:
        formTitle = 'Add a User to Organization';
        modalBody =
          <Form onSubmit={this.onSubmitAddUserToOrganization}>
            <Modal.Body>
              <Form.Group controlId='userEmailFormGroup'>
                <Form.Label>
                  <h5>Email</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Email'
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <h5>Group Name</h5>
                </Form.Label>
                <Select
                  options={
                    allGroupsInOrganization.map(group =>
                      ({value: group.group_name, label: group.group_name})
                    )
                  }
                  isMulti={false}
                  onChange={selected => this.onChangeSelectedGroup(selected)}
                  closeMenuOnSelect={true}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='dark' type='submit'>
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        break;
      case CREATE_GROUP:
        formTitle = 'Create a New Group';
        modalBody =
          <Form onSubmit={this.onSubmitCreateGroup}>
            <Modal.Body>
              <Form.Group controlId='groupNameFormGroup'>
                <Form.Label>
                  <h5>Name</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Group Name'
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <h5>Fume Hoods</h5>
                </Form.Label>
                <Select
                  options={
                    allFumeHoodsInOrganization.map(sensor =>
                      ({value: sensor.id, label: sensor.fume_hood_name})
                    )
                  }
                  isMulti={true}
                  onChange={options => this.onChangeSelectedSensors(options)}
                  closeMenuOnSelect={false}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='dark' type='submit'>
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        break;

      case CREATE_ORGANIZATION:
        formTitle = 'Create a New Organization';
        modalBody =
          <Form onSubmit={this.onSubmitAddNewOrganization}>
            <Modal.Body>
              <Form.Group controlId='organizationCodeFormGroup'>
                <Form.Label>
                  <h5>Code</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Organization Code'
                  required
                />
              </Form.Group>
              <Form.Group controlId='organizationNameFormGroup'>
                <Form.Label>
                  <h5>Name</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Organization Name'
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='dark' type='submit'>
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        break;

      case CREATE_SENSOR:
        formTitle = 'Add a New Sensor';
        modalBody =
          <Form onSubmit={this.onSubmitAddNewSensor}>
            <Modal.Body>
              <Form.Group controlId='addNewSensorIdFormGroup'>
                <Form.Label>
                  <h5>Sensor ID</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Sensor ID'
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <h5>Organization Code</h5>
                </Form.Label>
                <Select
                  options={
                    allOrganizations.map(organization =>
                      ({value: organization.code, label: organization.code})
                    )
                  }
                  isMulti={false}
                  onChange={selected => this.onChangeSelectedOrganizationCode(selected)}
                  closeMenuOnSelect={true}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='dark' type='submit'>
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        break;

      case UPDATE_ORGANIZATION_INFO:
        formTitle = 'Update Organization Info';
        modalBody =
          <Form onSubmit={this.onSubmitUpdateOrganizationInfo}>
            <Modal.Body>
              <Form.Group controlId='organizationCodeFormGroup'>
                <Form.Label>
                  <h5>Code</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Organization Code'
                  defaultValue={selectedOrganizationInfo.code}
                  required
                />
              </Form.Group>
              <Form.Group controlId='organizationNameFormGroup'>
                <Form.Label>
                  <h5>Name</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Organization Name'
                  defaultValue={selectedOrganizationInfo.name}
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='danger' onClick={this.onDeleteOrganization}>
                Delete Organization
              </Button>
              <Button variant='dark' type='submit'>
                Update Organization
              </Button>
            </Modal.Footer>
          </Form>
        break;

      case UPDATE_ORGANIZATION_ADMIN_INFO:
        formTitle = 'Update Organization Admin Info';
        modalBody =
          <Form onSubmit={this.onSubmitUpdateOrganizationAdminInfo}>
            <Modal.Body>
              <Form.Group controlId='userEmailFormGroup'>
                <Form.Label>
                  <h5>Email</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Email'
                  defaultValue={selectedUserInfo.email}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <h5>Organization Code</h5>
                </Form.Label>
                <Select
                  options={
                    allOrganizations.map(organization =>
                      ({value: organization.code, label: organization.code})
                    )
                  }
                  isMulti={false}
                  onChange={selected => this.onChangeSelectedOrganizationCode(selected)}
                  defaultValue={{value: selectedUserInfo.organization_code,
                      label: selectedUserInfo.organization_code}}
                  closeMenuOnSelect={true}
                />
              </Form.Group>
            <Modal.Footer>
              <Button variant='danger' onClick={this.onRemoveOrganizationAdmin}>
                Remove Organization Admin
              </Button>
              <Button variant='dark' type='submit'>Update Organization Admin Info</Button>
            </Modal.Footer>
            </Modal.Body>
          </Form>
        break;

      case UPDATE_SENSOR_INFO:
        formTitle = 'Update Sensor Info';
        modalBody =
          <Form onSubmit={this.onSubmitUpdateSensorInfo}>
            <Modal.Body>
              <Form.Group controlId='sensorIdFormGroup'>
                <Form.Label>
                  <h5>Sensor ID</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Sensor ID'
                  defaultValue={selectedSensorInfo.id}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <h5>Organization Code</h5>
                </Form.Label>
                <Select
                  options={
                    allOrganizations.map(organization =>
                      ({value: organization.code, label: organization.code})
                    )
                  }
                  isMulti={false}
                  onChange={selected => this.onChangeSelectedOrganizationCode(selected)}
                  defaultValue={{value: selectedSensorInfo.organization_code, label: selectedSensorInfo.organization_code}}
                  closeMenuOnSelect={true}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='dark' type='submit'> Update Sensor Info </Button>
            </Modal.Footer>
          </Form>
        break;

      case UPDATE_FUME_HOOD_INFO:
        formTitle = 'Update Fume Hood Info';
        modalBody =
          <Form onSubmit={this.onSubmitUpdateFumeHoodInfo}>
            <Modal.Body>
              <Row>
                <Col> <h5>Sensor ID/Mac Address</h5> </Col>
                <Col> {selectedSensorInfo.id} </Col>
              </Row>
              <Form.Group controlId='fumeHoodNameFormGroup'>
                <Form.Label>
                  <h5>Fume Hood Name</h5>
                </Form.Label>
                  <Form.Control
                    type='input'
                    placeholder='Fume Hood Name'
                    defaultValue={selectedSensorInfo.fume_hood_name}
                    required
                  />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='dark' type='submit'> Update Fume Hood Info </Button>
            </Modal.Footer>
          </Form>
        break;


      case UPDATE_FUME_HOOD_PAGE:
        formTitle = 'Update Fume Hood Page';
        modalBody = 
          <Form>
            <Modal.Body>
                <Form.Group controlId='fumeHoodNameUpdatePage'>
                    <Form.Label>
                      <h5>Fume Hood Name</h5>
                    </Form.Label>
                      <Form.Control
                        type='input'
                        placeholder='Fume Hood Name'
                        defaultValue={selectedSensorInfo.fume_hood_name}
                        required
                      />
                  <Form.Label>
                    <h5>Organization</h5>
                  </Form.Label>
                    <Form.Control
                      type='input'
                      placeholder='Organization'
                      defaultValue='Organization'
                      required
                    />
                  <Form.Label>
                    <h5>Building</h5>
                  </Form.Label>
                    <Form.Control
                      type='input'
                      placeholder='Building'
                      defaultValue='Building'
                      required
                    />
                  <Form.Label>
                    <h5>Room</h5>
                  </Form.Label>
                    <Form.Control
                      type='input'
                      placeholder='Room'
                      defaultValue='Room'
                      required
                    />
                    <Form.Label>
                    <h5>Lab</h5>
                  </Form.Label>
                    <Form.Control
                      type='input'
                      placeholder='Lab'
                      defaultValue='Lab'
                      required
                    />
                </Form.Group>
              </Modal.Body>
            <Modal.Footer>
              <Button variant='dark' type='submit'> Update Fume Hood </Button>
            </Modal.Footer>

          </Form> 
  
        break;
      
        case CREATE_FUME_HOOD:
          formTitle = 'Create Fume Hood';
          modalBody = 
            <Form>
              <Modal.Body>
                  <Form.Group controlId='fumeHoodNameCreatePage'>
                    <Form.Label>
                      <h5>Fume Hood Name</h5>
                    </Form.Label>
                      <Form.Control
                        type='input'
                        placeholder='Fume Hood Name'
                        defaultValue='Fume Hood Name'
                        required
                      />
                    <Form.Label>
                      <h5>Organization</h5>
                    </Form.Label>
                      <Form.Control
                        type='input'
                        placeholder='Organization'
                        defaultValue='Organization'
                        required
                      />
                    <Form.Label>
                      <h5>Building</h5>
                    </Form.Label>
                      <Form.Control
                        type='input'
                        placeholder='Building'
                        defaultValue='Building'
                        required
                      />
                    <Form.Label>
                      <h5>Room</h5>
                    </Form.Label>
                      <Form.Control
                        type='input'
                        placeholder='Room'
                        defaultValue='Room'
                        required
                      />
                      <Form.Label>
                      <h5>Lab</h5>
                    </Form.Label>
                      <Form.Control
                        type='input'
                        placeholder='Lab'
                        defaultValue='Lab'
                        required
                      />
                    <Form.Label>
                      <h5>Sensor MAC</h5>
                    </Form.Label>
                      <Form.Control
                        type='input'
                        placeholder='Sensor MAC'
                        defaultValue='Sensor MAC'
                        required
                      />
                  </Form.Group>
                </Modal.Body>
              <Modal.Footer>
                <Button variant='dark' type='submit'> Create Fume Hood </Button>
              </Modal.Footer>
  
            </Form> 
    
          break;
  
      case UPDATE_GROUP_INFO:
        formTitle = 'Update Group Info'
        modalBody =
          <Form onSubmit={this.onSubmitUpdateGroupInfo}>
            <Modal.Body>
              <Form.Group controlId='groupNameFormGroup'>
                <Form.Label>
                  <h5>Name</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Group Name'
                  defaultValue={selectedGroupInfo.group_name}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <h5>Fume Hoods</h5>
                </Form.Label>
                <Select
                  options={
                    allFumeHoodsInOrganization.map(sensor =>
                      ({value: sensor.id, label: sensor.fume_hood_name})
                    )
                  }
                  defaultValue={selectedGroupInfo.sensor_infos.map(
                      sensor_info => ({value: sensor_info.id, label: sensor_info.fume_hood_name}))}
                  isMulti={true}
                  onChange={options => this.onChangeSelectedSensors(options)}
                  closeMenuOnSelect={false}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              {/* TODO show are you sure message */}
              <Button variant='danger' onClick={this.onRemoveGroupFromOrganization}>
                Remove Group from Organization
              </Button>
              <Button variant='dark' type='submit'> Update Group Info </Button>
            </Modal.Footer>
          </Form>
        break;

      case UPDATE_USER_INFO:
        formTitle = 'Update User Info'
        modalBody =
          <Form onSubmit={this.onSubmitUpdateUserInfo}>
            <Modal.Body>
              <Form.Group controlId='userEmailFormGroup'>
                <Form.Label>
                  <h5>Email</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Email'
                  defaultValue={selectedUserInfo.email}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <h5>Group Name</h5>
                </Form.Label>
                <Select
                  options={
                    allGroupsInOrganization.map(group =>
                      ({value: group.group_name, label: group.group_name})
                    )
                  }
                  defaultValue={{value: selectedUserInfo.group_name, label: selectedUserInfo.group_name}}
                  isMulti={false}
                  onChange={selected => this.onChangeSelectedGroup(selected)}
                  closeMenuOnSelect={true}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              {/* TODO show are you sure message */}
              <Button variant='danger' onClick={this.onRemoveUserFromOrganization}>
                Remove User from Organization
              </Button>
              <Button variant='dark' type='submit'> Update User Info </Button>
            </Modal.Footer>
          </Form>
        break;

      default:
    }

    return {
      formTitle,
      modalBody
    };
  };

  render() {
    const { formType } = this.props;
    const { formTitle, modalBody } = this.renderFormContent();
    return (
      <Modal
        size='lg'
        show={formType}
        onHide={() => this.onCloseModal()}
        keyboard={false}
        backdrop={'static'}
      >
        <Modal.Header closeButton>
          <Modal.Title> {formTitle} </Modal.Title>
        </Modal.Header>
        {modalBody}
      </Modal>
    );
  }
}

export default ModalForm;
