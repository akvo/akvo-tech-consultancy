import React, { Component } from 'react';
import { Row, Col, Jumbotron } from "react-bootstrap";

class JumbotronWelcome extends Component {
    render() {
        let text = this.props.text;
        return (
            <Jumbotron>
                <Row className="page-header">
                    <Col md={12} className="page-title text-center">
                        <h2>Welcome to IDH Dataportal</h2>
                    </Col>
                </Row>
            </Jumbotron>
        );
    }
}

export default JumbotronWelcome;
