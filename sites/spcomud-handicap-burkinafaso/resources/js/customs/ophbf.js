import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import { Modal } from 'react-bootstrap';
import { filter } from 'lodash';

class OphBf extends Component {
    constructor(props) {
        super(props);
    }

    getChartData() {
        let page = this.props.value.page.name;
        let { source, locations, config, data } = this.props.value.filters[page];
        let { match_question } = config.maps;
        let { active } = this.props.value.base;

        let filteredData = locations.map(loc => {
            let filteredDataByLocation = filter(data, (x) => {
                return x[match_question].answer.toLowerCase().includes(loc.name.toLowerCase());
            });
            return {
                name: loc.name,
                value: filteredDataByLocation.length,
                active: true,
            }
        });

        // TODO :: filter the data base on first filter active & create stack bar chart for that
        console.log(active);
    }

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
                    { this.getChartData() }
                </Modal.Body>
            </>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OphBf);