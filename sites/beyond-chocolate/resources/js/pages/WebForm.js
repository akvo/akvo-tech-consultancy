import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import request from "../utils/request";

const WebForm = function() {
    useEffect(async () => {
        try {
            const response = await request().get("/api/me");
            console.log(response.data);
        } catch {}
    }, []);

    return (
        <Container fluid>
            <Row>
                <Col md={6}>
                    <h1>Web form</h1>
                </Col>
            </Row>
        </Container>
    );
};

export default WebForm;
