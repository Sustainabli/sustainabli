import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Form } from 'react-bootstrap';

export default function InfoModal() {
    const [show, setShow] = useState(true);
    const [password, setPassword] = useState("");

    const handleChange = (event) => {
        setPassword(event.target.value)
    }

    useEffect(() => {
        if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
            setShow(false);
        }
    }, [password]);

    return (
        <>
            <Modal show={show}>
                <Modal.Header closeButton>
                    <Modal.Title>Admin Access Only</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}