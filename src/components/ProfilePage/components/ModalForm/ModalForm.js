import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'
import { CREATE_GROUP, CREATE_ORGANIZATION, ADD_ORGANIZATION_ADMIN, CREATE_SENSOR, ADD_USER, ORGANIZATION_ADMIN_ROLE, USER_ROLE } from '../../../../utils/Constants';
import { addGroup, addOrganization, addSensor, fetchUserEmailsWithoutOrganization, updateUserInfo, updateUserRole } from '../../../../utils/Utils';

class ModalForm extends React.Component {
  constructor() {
    super();
    this.state = {
      // Select states
      selectedOrganizationCode: '',
      selectedGroup: '',
      selectedEmail: '',
      selectedSensors: [],
      // Organization admin can add users that don't belong to an organization to his organization
      allEmailsWithoutOrganization: [],
    }
  }

  componentDidMount = async () => {
    this.setState({
      allEmailsWithoutOrganization: await fetchUserEmailsWithoutOrganization(),
    });
  }

  // Functions for managing select states
  onChangeSelectedOrganizationCode = selected => {
    this.setState({
      selectedOrganizationCode: selected.value,
    });
  }
  onChangeSelectedGroup = selected => {
    this.setState({
      selectedGroup: selected.value,
    });
  }
  onChangeSelectedEmail = selected => {
    this.setState({
        selectedEmail: selected.value,
      });
  }
  onChangeSelectedSensors = options => {
    this.setState({
      selectedSensors: options.map(option => option.value),
    });
  }
  onCloseModal = () => {
    const { clearModalFormType } = this.props;
    this.setState({
      selectedOrganizationCode: [],
      selectedEmail: [],
      selectedSensors: [],
    });
    clearModalFormType();
  }

  // Functions for adding new organization
  onSubmitAddNewOrganization = async event => {
    event.preventDefault();
    const { updateAllOrganizationsList, clearModalFormType } = this.props;

    const organizationCode = event.target.elements.addNewOrganizationCodeFormGroup.value;
    const organizationName = event.target.elements.addNewOrganizationNameFormGroup.value;
    const reqBody = {
      organization_code: organizationCode,
      organization_name: organizationName,
    }
    const allOrganizations = await addOrganization(reqBody);

    updateAllOrganizationsList(allOrganizations);
    clearModalFormType();
  };

  // Functions for adding new sensor
  onSubmitAddNewSensor = async event => {
    event.preventDefault();
    const { updateAllSensorsList, clearModalFormType } = this.props;
    const { selectedOrganizationCodeForNewSensor } = this.state;

    const sensorId = event.target.elements.addNewSensorIdFormGroup.value;
    const reqBody = {
      sensor_id: sensorId,
      organization_code: selectedOrganizationCodeForNewSensor,
    }

    const allSensors = await addSensor(reqBody);
    updateAllSensorsList(allSensors);
    clearModalFormType();
  }

  // Functions for adding organization admins
  onSubmitAddOrganizationAdmin = async (event) => {
    event.preventDefault();
    const { updateAllOrganizationAdminUsers, clearModalFormType } = this.props;
    const { selectedEmailForNewOrganizationAdmin, selectedOrganizationCodeForNewOrganizationAdmin } = this.state;

    const reqBody = {
      email: selectedEmailForNewOrganizationAdmin,
      role: ORGANIZATION_ADMIN_ROLE,
      organization_code: selectedOrganizationCodeForNewOrganizationAdmin,
    }

    const allOrganizationAdminUsers = await updateUserRole(reqBody);
    updateAllOrganizationAdminUsers(allOrganizationAdminUsers);
    clearModalFormType();
  }

  // Functions for adding user to organization
  onSubmitAddUserToOrganization = async (event) => {
    event.preventDefault();
    const { selectedEmail, selectedGroup } = this.state;
    const { userInfo, updateAllUsersInOrganization, clearModalFormType } = this.props;

    const reqBody = {
      email: selectedEmail,
      role: USER_ROLE,
      organization_code: userInfo.organizationCode,
      group_name: selectedGroup,
    }

    const allUsersInOrganization = await updateUserInfo(reqBody);
    updateAllUsersInOrganization(allUsersInOrganization);
    clearModalFormType();
  }

  // Functions for adding new group
  onSubmitAddNewGroup = async event => {
    event.preventDefault();
    const { selectedSensorsForNewGroup } = this.state;
    const { updateAllGroupsInOrganization, clearModalFormType, userInfo } = this.props;

    const groupName = event.target.elements.addNewGroupNameFormGroup.value;
    const reqBody = {
      group_name: groupName,
      organization_code: userInfo.organizationCode,
      sensors: selectedSensorsForNewGroup
    }
    const allGroupsInOrganization = await addGroup(reqBody);

    updateAllGroupsInOrganization(allGroupsInOrganization);
    clearModalFormType();
  }

  renderFormContent = () => {
    const { allEmailsWithoutOrganization } = this.state;
    const { formType, allSensorsInOrganization, allOrganizations, allUserEmails, allGroupsInOrganization } = this.props;

    let formTitle = '';
    let modalBody;
    // TODO put limit on form fields
    switch (formType) {
      case CREATE_ORGANIZATION:
        formTitle = 'Create a New Organization';
        modalBody =
          <Form onSubmit={this.onSubmitAddNewOrganization}>
            <Modal.Body>
              <Form.Group controlId='addNewOrganizationCodeFormGroup'>
                <Form.Label>
                  <h5>Code</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Organization Code'
                  required
                />
              </Form.Group>
              <Form.Group controlId='addNewOrganizationNameFormGroup'>
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
              <Button variant='primary' type='submit'>
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
              <Button variant='primary' type='submit'>
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        break;
      case ADD_ORGANIZATION_ADMIN:
        formTitle = 'Add an Organization Admin';
        modalBody =
          <Form onSubmit={this.onSubmitAddOrganizationAdmin}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>
                  <h5>Email</h5>
                </Form.Label>
                <Select
                  options={
                    allUserEmails.map(user =>
                      ({value: user.email, label: user.email})
                    )
                  }
                  isMulti={false}
                  onChange={selected => this.onChangeSelectedEmail(selected)}
                  closeMenuOnSelect={true}
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
              <Button variant='primary' type='submit'>
                Submit
              </Button>
            </Modal.Footer>
            </Modal.Body>
          </Form>
        break;
      case ADD_USER:
        formTitle = 'Add a User to Organization'
        modalBody =
          <Form onSubmit={this.onSubmitAddUserToOrganization}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>
                  <h5>Email</h5>
                </Form.Label>
                <Select
                  options={
                    allEmailsWithoutOrganization.map(user =>
                      ({value: user.email, label: user.email})
                    )
                  }
                  isMulti={false}
                  onChange={selected => this.onChangeSelectedEmail(selected)}
                  closeMenuOnSelect={true}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <h5>Group Name</h5>
                </Form.Label>
                <Select
                  options={
                    allGroupsInOrganization.map(group =>
                      ({value: group.name, label: group.name})
                    )
                  }
                  isMulti={false}
                  onChange={selected => this.onChangeSelectedGroup(selected)}
                  closeMenuOnSelect={true}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='primary' type='submit'>
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        break;
      case CREATE_GROUP:
        formTitle = 'Create a New Group';
        modalBody =
          <Form onSubmit={this.onSubmitAddNewGroup}>
            <Modal.Body>
              <Form.Group controlId='addNewGroupNameFormGroup'>
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
                    allSensorsInOrganization.map(sensor =>
                      ({value: sensor.id, label: sensor.fumeHoodName})
                    )
                  }
                  isMulti={true}
                  onChange={options => this.onChangeSelectedSensors(options)}
                  closeMenuOnSelect={false}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='primary' type='submit'>
                Submit
              </Button>
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
