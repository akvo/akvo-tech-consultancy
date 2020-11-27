import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../components/auth-context";

const WebForm = () => {
    const { user } = useAuth();
    const [selected, setSelected] = useState();

    return (
        <Container fluid>
            <Row>
                <Col md={12} style={{ height: "100vh" }}>
                    {selected && (
                        <iframe
                            frameBorder="0"
                            style={{ height: "100vh", width: "100%" }}
                            src={selected}
                        />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default WebForm;
