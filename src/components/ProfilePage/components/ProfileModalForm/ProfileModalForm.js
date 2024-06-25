// Modal form specific to the profile page
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select'
import {
  // Modal form types
  ADD_ORGANIZATION_ADMIN,
  CREATE_ORGANIZATION,
  CREATE_SENSOR,
  UPDATE_ORGANIZATION_INFO,
  UPDATE_ORGANIZATION_ADMIN_INFO,
  UPDATE_SENSOR_INFO,
} from '../../../../utils/Constants';
import { 
  createOrUpdateOrganizationAdmin, 
  createSensor,
  updateSensorInfo,
  createOrganization,
  updateOrganizationInfo,
} from '../../../../utils/Requests';

function ProfileModalForm(props) {
  const {
    formType,
    selectedOrganizationInfo,
    selectedSensorInfo,
    selectedUserInfo,
    closeModal,
    localAllOrganizations,
    setLocalAllOrganizations,
    setLocalAllSensorsInfo,
    setLocalAllOrganizationAdminUsers,
  } = props;

  const [queryOrganizationCode, setQueryOrganizationCode] = useState("");

  const onSubmitCreateSensor = async (event) => {
    event.preventDefault();
    const sensorId = event.target.elements.createSensorIdFormGroup.value;

    const result = await createSensor(sensorId, queryOrganizationCode);
    setLocalAllSensorsInfo(result);
    closeModal();
  }

  const onSubmitCreateOrganization = async event => {
    event.preventDefault();

    const organizationCode = event.target.elements.organizationCodeFormGroup.value;
    const organizationName = event.target.elements.organizationNameFormGroup.value;

    const result = await createOrganization(organizationCode, organizationName);
    setLocalAllOrganizations(result);
    closeModal();
  }

  const onSubmitUpdateOrganizationInfo = async event => {
    event.preventDefault();

    const newOrganizationCode = event.target.elements.organizationCodeFormGroup.value;
    const newOrganizationName = event.target.elements.organizationNameFormGroup.value;

    const result = await updateOrganizationInfo(selectedOrganizationInfo.code, newOrganizationCode, newOrganizationName);
    setLocalAllOrganizations(result);
    closeModal();
  }

  const onSubmitAddOrganizationAdmin = async (event) => {
    event.preventDefault();
    const email = event.target.elements.userEmailFormGroup.value;

    const result = await createOrUpdateOrganizationAdmin(email, queryOrganizationCode);
    setLocalAllOrganizationAdminUsers(result);
    closeModal();
  }

  const onSubmitUpdateSensorInfo = async event => {
    event.preventDefault();

    const newSensorId = event.target.elements.sensorIdFormGroup.value;
    const result = await updateSensorInfo(newSensorId, selectedSensorInfo.sensor_id, queryOrganizationCode);
    setLocalAllSensorsInfo(result);
    closeModal();
  }

  const onSubmitUpdateOrganizationAdminInfo = async (event) => {
    event.preventDefault();

    // TODO: check for not found email
    const result = await createOrUpdateOrganizationAdmin(selectedUserInfo.email, queryOrganizationCode);
    setLocalAllOrganizationAdminUsers(result);
    closeModal();
  }


  let formTitle = '';
  let modalBody;

  switch (formType) {
    case CREATE_ORGANIZATION:
      formTitle = 'Create a New Organization';
      modalBody =
        <Form onSubmit={onSubmitCreateOrganization}>
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
              Create Organization
            </Button>
          </Modal.Footer>
        </Form>
      break;

      case UPDATE_ORGANIZATION_INFO:
        formTitle = 'Update Organization Info';
        modalBody =
          <Form onSubmit={onSubmitUpdateOrganizationInfo}>
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
              <Button variant='dark' type='submit'>
                Update Organization
              </Button>
            </Modal.Footer>
          </Form>
        break;

      case CREATE_SENSOR:
        formTitle = 'Create a New Sensor';
        modalBody =
          <Form onSubmit={onSubmitCreateSensor}>
            <Modal.Body>
              <Form.Group controlId='createSensorIdFormGroup'>
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
                    localAllOrganizations.map(organization =>
                      ({value: organization.code, label: organization.code})
                    )
                  }
                  isMulti={false}
                  onChange={selected => setQueryOrganizationCode(selected.value)}
                  closeMenuOnSelect={true}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='dark' type='submit'>
                Create Sensor
              </Button>
            </Modal.Footer>
          </Form>
        break;

    case UPDATE_SENSOR_INFO:
      formTitle = 'Update Sensor Info';
      modalBody =
        <Form onSubmit={onSubmitUpdateSensorInfo}>
          <Modal.Body>
            <Form.Group controlId='sensorIdFormGroup'>
              <Form.Label>
                <h5>Sensor ID</h5>
              </Form.Label>
              <Form.Control
                type='input'
                placeholder='Sensor ID'
                defaultValue={selectedSensorInfo.sensor_id}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <h5>Organization Code</h5>
              </Form.Label>
              <Select
                options={
                  localAllOrganizations.map(organization =>
                    ({value: organization.code, label: organization.code})
                  )
                }
                isMulti={false}
                onChange={selected => setQueryOrganizationCode(selected.value)}
                defaultValue={
                  {value: selectedSensorInfo.organization_code, label: selectedSensorInfo.organization_code}
                }
                closeMenuOnSelect={true}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='dark' type='submit'> Update Sensor Info </Button>
          </Modal.Footer>
        </Form>
      break;

    case ADD_ORGANIZATION_ADMIN:
        formTitle = 'Add an Organization Admin';
        modalBody =
          <Form onSubmit={onSubmitAddOrganizationAdmin}>
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
                    localAllOrganizations.map(organization =>
                      ({value: organization.code, label: organization.code})
                    )
                  }
                  isMulti={false}
                  onChange={selected => setQueryOrganizationCode(selected.value)}
                  closeMenuOnSelect={true}
                />
              </Form.Group>
            <Modal.Footer>
              <Button variant='dark' type='submit'>
                Add Organization Admin
              </Button>
            </Modal.Footer>
            </Modal.Body>
          </Form>
        break;

      case UPDATE_ORGANIZATION_ADMIN_INFO:
        formTitle = 'Update Organization Admin Info';
      modalBody =
        <Form onSubmit={onSubmitUpdateOrganizationAdminInfo}>
          <Modal.Body>
            <Form.Group controlId='userEmailFormGroup'>
              <Form.Label>
                <h5>Email</h5>
              </Form.Label>
              <Form.Control
                type='input'
                placeholder='Email'
                defaultValue={selectedUserInfo.email}
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <h5>Organization Code</h5>
              </Form.Label>
              <Select
                options={
                  localAllOrganizations.map(organization =>
                    ({value: organization.code, label: organization.code})
                  )
                }
                isMulti={false}
                onChange={selected => setQueryOrganizationCode(selected.value)}
                defaultValue={
                  {value: selectedUserInfo.organization_code, label: selectedUserInfo.organization_code}
                }
                closeMenuOnSelect={true}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant='dark' type='submit'>
                Update Organization Admin
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Form>
      break;

    default:
  }

  return (
    <Modal
      size='lg'
      show={formType}
      onHide={() => closeModal()}
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

export default ProfileModalForm;
