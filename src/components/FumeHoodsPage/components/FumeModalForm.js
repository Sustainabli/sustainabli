import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "../FumeHoodsPage.scss";
import { CREATE_SENSOR, UPDATE_FUME_HOOD_INFO } from "../../../utils/Constants";

class FumeModalForm extends React.Component {
  onCloseModal = () => {
    const { clearModalFormType } = this.props;
    clearModalFormType();
  };

  renderFormContent = () => {
    const { formType, selectedSensorInfo } = this.props;

    let formTitle = "";
    let modalBody;

    switch (formType) {
      case UPDATE_FUME_HOOD_INFO:
        formTitle = "Update Fume Hood Page";
        modalBody = (
          <Form>
            <Modal.Body>
              <Form.Group controlId="fumeHoodNameUpdatePage">
                <Form.Label>
                  <h5>Fume Hood Name</h5>
                </Form.Label>
                <Form.Control
                  type="input"
                  placeholder={selectedSensorInfo.fume_hood_name}
                  required
                />
                <Form.Label>
                  <h5>Organization</h5>
                </Form.Label>
                <Form.Control
                  type="input"
                  placeholder="Organization"
                  required
                />
                <Form.Label>
                  <h5>Building</h5>
                </Form.Label>
                <Form.Control type="input" placeholder="Building" required />
                <Form.Label>
                  <h5>Room</h5>
                </Form.Label>
                <Form.Control type="input" placeholder="Room" required />
                <Form.Label>
                  <h5>Lab</h5>
                </Form.Label>
                <Form.Control type="input" placeholder="Lab" required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="info" type="submit">
                {" "}
                Update Fume Hood{" "}
              </Button>
            </Modal.Footer>
          </Form>
        );
        break;

      case CREATE_SENSOR:
        formTitle = "Create Fume Hood";
        modalBody = (
          <Form>
            <Modal.Body>
              <Form.Group controlId="fumeHoodNameCreatePage">
                <Form.Label>
                  <h5>Fume Hood Name</h5>
                </Form.Label>
                <Form.Control
                  type="input"
                  placeholder="Fume Hood Name"
                  required
                />
                <Form.Label>
                  <h5>Organization</h5>
                </Form.Label>
                <Form.Control
                  type="input"
                  placeholder="Organization"
                  required
                />
                <Form.Label>
                  <h5>Building</h5>
                </Form.Label>
                <Form.Control type="input" placeholder="Building" required />
                <Form.Label>
                  <h5>Room</h5>
                </Form.Label>
                <Form.Control type="input" placeholder="Room" required />
                <Form.Label>
                  <h5>Lab</h5>
                </Form.Label>
                <Form.Control type="input" placeholder="Lab" required />
                <Form.Label>
                  <h5>Sensor MAC</h5>
                </Form.Label>
                <Form.Control type="input" placeholder="Sensor MAC" required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="info" type="submit">
                {" "}
                Create Fume Hood{" "}
              </Button>
            </Modal.Footer>
          </Form>
        );
        break;

      default:
    }
    return {
      formTitle,
      modalBody,
    };
  };
  render() {
    const { formType } = this.props;
    const { formTitle, modalBody } = this.renderFormContent();
    return (
      <Modal
        size="lg"
        show={formType}
        onHide={() => this.onCloseModal()}
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
}

export default FumeModalForm;
