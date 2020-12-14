import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import { Modal } from 'react-bootstrap';
import { filter, find } from 'lodash';

class OphBf extends Component {
    constructor(props) {
        super(props);
    }

    getChartData() {
        let page = this.props.value.page.name;
        let { source, locations, config, data } = this.props.value.filters[page];
        let { match_question } = config.maps;
        let { active } = this.props.value.base;
        let activeFilterValues = find(config.first_filter, (x) => x.question_id === active.ff_qid);

        let filteredData = locations.map(loc => {
            let filteredDataByLocation = filter(data, (x) => {
                return x[match_question].answer.toLowerCase().includes(loc.name.toLowerCase());
            });

            let mapFirstFilter = activeFilterValues.values.map(val => {
                let filteredDataByFirstFilter = filter(filteredDataByLocation, (y) => {
                    if (typeof y[active.ff_qid] === 'undefined') {
                        return null;
                    }
                    return y[active.ff_qid].answer.toLowerCase().includes(val.text.toLowerCase());
                });
                return {
                    legend: val.text,
                    value: filteredDataByFirstFilter.length,
                }
            });

            return {
                name: loc.name,
                value: filteredDataByLocation.length,
                ff_value: mapFirstFilter,
            }
        });

        // TODO :: filter the data base on first filter active & create stack bar chart for that
        console.log(filteredData);
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