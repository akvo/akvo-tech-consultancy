import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import { configs } from '../customs/configs';

class ModalDetail extends Component {
    constructor(props) {
        super(props);
    }

    hideModal() {
        this.props.modal.toggle(false, 'toggleModalDetail');
    }

    render() {
        let { modal } = this.props.value.base;
        let page = this.props.value.page.name;
        let { source, config } = this.props.value.filters[page];
        let js = null;
        if (source !== null) {
            js = config.template.js;
        }

        return (
            <Modal 
                show={modal.toggleModalDetail}
                onHide={() => this.hideModal()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                { (source !== null) ? configs[js] : "" }
                <Modal.Footer>
                    <Button onClick={() => this.hideModal()}>Close</Button>
                </Modal.Footer>
            </Modal> 
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDetail);