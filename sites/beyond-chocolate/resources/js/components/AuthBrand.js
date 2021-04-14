import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const AuthBrand = ({ text }) => {
    return (
            <Col md={6}>
                <h2>{ text.welcome2 }!</h2>
                <Row className="align-items-center">
                    <Col md={6}>
                        <img src="/images/beyond.jpg" alt="Beyond Chocolate" />
                    </Col>
                    <Col md={6}>
                        <img src="/images/gisco.jpg" alt="German Initiative on Sustainable Cocoa" />
                    </Col>
                </Row>
            </Col>
    );
};

export default AuthBrand;
