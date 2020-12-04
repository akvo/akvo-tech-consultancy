import React from "react";
import { Button, Modal } from "react-bootstrap";

const ModalDataSecurity = ({ text, show, handleClose, locale, data }) => {
    return (
        <Modal size="xl" scrollable={true} show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{ text.modalDataSecurity }</Modal.Title>
            </Modal.Header>
            <Modal.Body>{data[locale.active]}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    { text.btnClose }
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export { ModalDataSecurity };