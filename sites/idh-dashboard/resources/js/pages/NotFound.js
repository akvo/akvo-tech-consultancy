import React, { Component } from 'react';
import { Row, Col, Jumbotron, Button } from "react-bootstrap";

class NotFound extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Jumbotron>
                    <Row className="page-header">
                        <Col md={12} className="page-title text-center">
                            <h2>Page Not Found</h2>
                        </Col>
                    </Row>
                </Jumbotron>
                <div className="page-content has-jumbotron text-center">
                    <Row className="justify-content-md-center">
                        <Col md={3}>
                            The page is not available
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default NotFound;
