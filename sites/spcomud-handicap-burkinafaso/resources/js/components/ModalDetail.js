import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';

class ModalDetail extends Component {
    constructor(props) {
        super(props);
    }

    hideModal() {
        this.props.modal.toggle(false, 'toggleModalDetail');
    }

    render() {
        let { modal } = this.props.value.base;

        return (
            <Modal 
                show={modal.toggleModalDetail}
                onHide={() => this.hideModal()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Modal heading test
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Centered Modal</h4>
                    <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                    consectetur ac, vestibulum at eros.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.hideModal()}>Close</Button>
                </Modal.Footer>
            </Modal> 
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDetail);