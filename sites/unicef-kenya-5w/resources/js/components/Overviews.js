import React, { Component, Fragment } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import {
    Container,
    Row,
    Col,
    Card,
    ListGroup
} from 'react-bootstrap';

class Overviews extends Component {

    constructor(props) {
        super(props);
        this.countDetail = this.countDetail.bind(this)
    }

    countDetail(data, name) {
        return (
            <Col>
              <Card style={{ marginBottom: '1rem'}}>
                <Card.Header style={{textAlign:'center'}}>{name}</Card.Header>
                <ListGroup variant="flush" style={{textAlign:'center'}}>
                  <ListGroup.Item>{data.length}</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
        )
    }

    render() {
        let details = this.props.value.filters.overviews;
        return (
            <Row>
            {this.countDetail(details.donors, "Donors")}
            {this.countDetail(details.implementing, "Implementing")}
            {this.countDetail(details.organisations, "Organisations")}
            {this.countDetail(details.all, "All")}
            </Row>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Overviews);
