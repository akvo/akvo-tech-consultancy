import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = function() {
    return (
        <Container fluid className="mt-md-5">
            <Row>
                <Col>
                    <p>Akvo</p>
                    <p>© 2020</p>
                </Col>
                <Col>
                    <img src="/images/example.png" />
                </Col>
            </Row>
        </Container>
    );
};

export default Footer;
