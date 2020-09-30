import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import {
    Row,
    Col,
    Jumbotron,
} from 'react-bootstrap';
import Charts from '../components/Charts.js';
import Cards from '../components/Cards.js';
import { queueApi, getApi } from '../data/api.js';
import { generateData } from "../charts/chart-generator.js";

class Compare extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div className="page-content">
                    <Row>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
