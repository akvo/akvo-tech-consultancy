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

const SaveFormModal = ({ text, show, onHide, onConfirm }) => {
    return (
        <Modal size="md" scrollable={true} show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                  { text.modalSaveForm }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{ text.valClickSave }</p>
              <p>{ text.valClickYes }</p>
              <p>{ text.valClickNo }</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onHide}>
                    { text.btnNo }
                </Button>
                <Button variant="secondary" onClick={onConfirm}>
                    { text.btnYes }
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const ModalImpressum = ({ text, content, show, handleClose}) => {
    return (
        <Modal size="xl" scrollable={true} show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{ content.t }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { content.c }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    { text.btnClose }
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export { ModalDataSecurity, SaveFormModal, ModalImpressum };
