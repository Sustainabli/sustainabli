import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "../FumeHoodsPage.scss";
import { CREATE_SENSOR, UPDATE_FUME_HOOD_INFO } from "../../../utils/Constants";
import { updateFumeHoodInfo } from "../../../utils/Utils";

class FumeModalForm extends React.Component {
  onCloseModal = () => {
    const { clearModalFormType } = this.props;
    clearModalFormType();
  };

  /** Functions for updating fume hoods (organization_admin perspective) on the fume hoods page**/
  onSubmitUpdateFumeHoodInfo = async (event) => {
    event.preventDefault();
    const {
      clearModalFormType,
      selectedSensorInfo,
      setAvailableSensors
    } = this.props;

    //0: fume hood name, 1: building, 2: room, 3: lab
    const fumeHoodName = event.target.elements.fumeHoodNameUpdatePage[0].value;
    const building = event.target.elements.fumeHoodNameUpdatePage[1].value;
    const room = event.target.elements.fumeHoodNameUpdatePage[2].value;
    const lab = event.target.elements.fumeHoodNameUpdatePage[3].value.trim().split(" ");

    const result = await updateFumeHoodInfo(
      selectedSensorInfo.sensor_id,
      fumeHoodName,
      building,
      room,
      lab,
      selectedSensorInfo.organization_code
    );
    setAvailableSensors(result.fume_hoods);
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
          <Form onSubmit={this.onSubmitUpdateFumeHoodInfo}>
            <Modal.Body>
              <Form.Group controlId="fumeHoodNameUpdatePage">
                <Form.Label>
                  <h5>Fume Hood Name</h5>
                </Form.Label>
                <Form.Control
                  type="input"
                  defaultValue={selectedSensorInfo.fume_hood_name}
                  required
                />
                <Form.Label>
                  <h5>Building</h5>
                </Form.Label>
                <Form.Control
                  type="input"
                  defaultValue={selectedSensorInfo.building}
                  required
                />
                <Form.Label>
                  <h5>Room</h5>
                </Form.Label>
                <Form.Control
                  type="input"
                  defaultValue={selectedSensorInfo.room}
                  required
                />
                <Form.Label>
                  <h5>Lab</h5>
                </Form.Label>
                <Form.Control
                  type="input"
                  defaultValue={selectedSensorInfo.groups.join(", ")}
                  required
                />
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
