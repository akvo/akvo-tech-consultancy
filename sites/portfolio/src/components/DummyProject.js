import React, { Component } from 'react';
import { Row, Button, Col, Card } from "react-bootstrap";

class DummyProject extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Col md={4} style={{marginBottom: 2 + "rem"}}>
                <Card>
                    <Card.Body>
                        <Card.Title className="text-center">Example Project</Card.Title>
                        <Card.Img variant="top" src="https://via.placeholder.com/150/eee/fff"/>
                        <hr/>
                        <Card.Text className="text-center">
                            Target: 100 Data<br/> Start Date: Dec 12 2018<br/> Duration 30 Days
                        </Card.Text>
                        <Button className="btn btn-tiny btn-block">Show Project</Button>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}

export default DummyProject;
