import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

class Erd extends Component {
    render() {
        return (
            <Container>
                <Row className="justify-content-md-center">
                    <Col xs={12} sm={12} md={12}>
                        <Image 
                            className="d-block mx-auto img-fluid w-95 mt-5" 
                            src="/images/unep-erd.png" 
                            alt="erd image" 
                            fluid />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Erd;