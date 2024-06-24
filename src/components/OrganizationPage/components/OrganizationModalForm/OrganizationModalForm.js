// Modal form that ORGANIZATION_ADMIN can use to update accounts and groups/labs on the organization page

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Select from 'react-select'
import { ADD_USER_TO_ORGANIZATION, CREATE_GROUP, UPDATE_USER_GROUP } from "../../../../utils/Constants";

function OrganizationModalForm(props) {
  const { 
    closeModal, 
    formType,
    onSubmitAddUserToOrganization,
    localGroupsInOrganization,
    onChangeSelectedGroup,
  } = props;

  const renderFormContent = () => {
    let formTitle = "";
    let modalBody;

    switch (formType) {
      case CREATE_GROUP:
        formTitle = "Create Lab";
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
                  <h5>Group Name</h5>
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
    }
    return { formTitle, modalBody };
  }

  const { formTitle, modalBody } = renderFormContent();

  return (
    <Modal
      size="lg"
      show={formType}
      onHide={() => closeModal}
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
