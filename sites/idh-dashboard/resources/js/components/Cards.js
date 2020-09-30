import React, { Component } from 'react';
import { Col } from "react-bootstrap";

class Cards extends Component {
    constructor(props) {
        super(props);
        this.generateRows = this.generateRows.bind(this);
    }

    generateRows(x, i) {
        return (
            <Col key={'col-' + i} md={12} className="card-info text-center">
                <h2>{x.kind ==="PERCENT" ? x.data + "%" : x.data}</h2>
                <p>{x.description}</p>
            </Col>
        )
    }

    render() {
        return (
            <Col md={this.props.config.column}>
                {this.props.dataset.map((x,i) => this.generateRows(x,i))}
            </Col>
        );
    }
}

export default Cards;
