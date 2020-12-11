import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import { Modal } from 'react-bootstrap';

class OphBf extends Component {
    constructor(props) {
        super(props);
    }

    // TODO : Render chart here
    render() {
        let { modal } = this.props.value.base;
        let { name, value, active } = modal.selectedModalDetail;

        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        { name }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Centered Modal</h4>
                    <p>Render chart here...</p>
                </Modal.Body>
            </>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OphBf);