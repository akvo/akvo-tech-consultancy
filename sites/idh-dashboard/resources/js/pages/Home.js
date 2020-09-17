import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import {
    Row,
    Col,
    Jumbotron,
    Dropdown
} from 'react-bootstrap';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Jumbotron>
                <Row className="page-header">
                    <Col md={12} className="page-title text-right">
                        <h2>Welcome</h2>
                    </Col>
                </Row>
            </Jumbotron>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
