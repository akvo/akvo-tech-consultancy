import React, { Component } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import {
    Col,
    Card,
    ListGroup
} from 'react-bootstrap';

class Overviews extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Col md={3}>
              <Card style={{ marginBottom: '1rem'}}>
                <Card.Header style={{textAlign:'center'}}>Organisations</Card.Header>
                <ListGroup variant="flush" style={{textAlign:'center'}}>
                  <ListGroup.Item>70</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Overviews);
