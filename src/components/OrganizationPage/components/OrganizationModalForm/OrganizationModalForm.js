// Modal form that ORGANIZATION_ADMIN can use to update accounts and groups/labs on the organization page

import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Select from 'react-select'
import { useRecoilValue } from "recoil";
import { ADD_USER_TO_ORGANIZATION, CREATE_GROUP, UPDATE_USER_GROUP, UPDATE_GROUP_INFO } from "../../../../utils/Constants";
import { availableSensorInfoSelector, userInfoSelector } from "../../../../utils/Recoil";
import { createGroup, updateGroup } from "../../../../utils/Requests";

function OrganizationModalForm(props) {
  const { 
    closeModal, 
    formType,
    onSubmitAddUserToOrganization,
    localGroupsInOrganization,
    onChangeSelectedGroup,
    selectedUser,
    onSubmitUpdateUserGroup,
    setLocalGroupsInOrganization,
    selectedGroup,
  } = props;

  const userInfo = useRecoilValue(userInfoSelector);
  const availableSensorInfos = useRecoilValue(availableSensorInfoSelector);

  const [selectedSensors, setSelectedSensors] = useState([]);

  const onSubmitCreateGroup = async (event) => {
    event.preventDefault();
    const groupName = event.target.elements.groupNameFormGroup.value;
    const result = await createGroup(groupName, userInfo.organization_code, selectedSensors);
    setLocalGroupsInOrganization(result);
    closeModal();
  }

  const onSubmitUpdateGroup = async (event) => {
    event.preventDefault();
    const groupName = event.target.elements.groupNameFormGroup.value;
    const result = await updateGroup(groupName, selectedGroup.group_name, userInfo.organization_code, selectedSensors);
    setLocalGroupsInOrganization(result);
    closeModal();
  }

  const renderFormContent = () => {
    let formTitle = "";
    let modalBody;

    switch (formType) {
      case CREATE_GROUP:
        formTitle = "Create Lab";
        modalBody = (
          <Form onSubmit={onSubmitCreateGroup}>
            <Modal.Body>
              <Form.Group controlId='groupNameFormGroup'>
                <Form.Label>
                  <h5>Lab Name</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Lab Name'
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <h5>Fume Hoods</h5>
                </Form.Label>
                <Select
                  options={
                    availableSensorInfos.map(sensor =>
                      ({value: sensor.sensor_id, label: sensor.fume_hood_name})
                    )
                  }
                  isMulti={true}
                  onChange={options => setSelectedSensors(options.map(option => ({
                    id: option.value,
                    fume_hood_name: option.label
                  })))}
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
        );
        break;

      case UPDATE_GROUP_INFO:
        formTitle = "Update Lab Info";
        modalBody = (
          <Form onSubmit={onSubmitUpdateGroup}>
            <Modal.Body>
              <Form.Group controlId='groupNameFormGroup'>
                <Form.Label>
                  <h5>Lab Name</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  placeholder='Lab Name'
                  defaultValue={selectedGroup.group_name}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <h5>Fume Hoods</h5>
                </Form.Label>
                <Select
                  options={
                    availableSensorInfos.map(sensor =>
                      ({value: sensor.sensor_id, label: sensor.fume_hood_name})
                    )
                  }
                  isMulti={true}
                  onChange={options => setSelectedSensors(options.map(option => ({
                    id: option.value,
                    fume_hood_name: option.label
                  })))}
                  defaultValue={selectedGroup.sensor_infos.map(sensor_info => ({value: sensor_info.id, label: sensor_info.fume_hood_name}))}
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
        )
        break;

      case UPDATE_USER_GROUP:
        formTitle = "Update User's Lab";
        modalBody = (
          <Form onSubmit={onSubmitUpdateUserGroup}>
            <Modal.Body>
              <Form.Group controlId='userEmailFormGroup'>
                <Form.Label>
                  <h5>Email</h5>
                </Form.Label>
                <Form.Control
                  type='input'
                  value={selectedUser.email}
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <h5>Lab Name</h5>
                </Form.Label>
                <Select
                  options={localGroupsInOrganization.map(group =>
                    ({value: group.group_name, label: group.group_name})
                  )
                  }
                  isMulti={false}
                  onChange={selected => onChangeSelectedGroup(selected)}
                  defaultValue={selectedGroup.group_name}
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
        );
        break;

      case ADD_USER_TO_ORGANIZATION:
        formTitle = "Add User to Organization";
        modalBody = (
          <Form onSubmit={onSubmitAddUserToOrganization}>
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
                  <h5>Lab Name</h5>
                </Form.Label>
                <Select
                  options={localGroupsInOrganization.map(group =>
                    ({value: group.group_name, label: group.group_name})
                  )
                  }
                  isMulti={false}
                  onChange={selected => onChangeSelectedGroup(selected)}
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
        );
        break;
      default:
    }
    return { formTitle, modalBody };
  }

  const { formTitle, modalBody } = renderFormContent();

  return (
    <Modal
      size="lg"
      show={formType}
      onHide={() => closeModal()}
      keyboard={false}
      backdrop={"static"}
    >
      <Modal.Header closeButton>
        <Modal.Title> {formTitle} </Modal.Title>
      </Modal.Header>
      {modalBody}
    </Modal>
  );
}

export default OrganizationModalForm;
