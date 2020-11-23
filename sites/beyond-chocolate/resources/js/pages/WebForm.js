import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../components/auth-context";

const WebForm = () => {
    const { user } = useAuth();
    return (
        <Container fluid>
            <Row>
                <Col md={12}>
                    {user.form && (
                        <iframe
                            frameBorder="0"
                            style={{ height: "100vh", width: "100%" }}
                            src={user.form}
                        />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default WebForm;
