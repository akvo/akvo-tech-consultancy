import React, { useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../components/auth-context";

const WebForm = () => {
    const iframeRef = useRef();
    const iframeHeight = (window.innerHeight - 284) * 2;
    const { user } = useAuth();
    return (
        <Container fluid>
            <Row>
                <Col md={12}>
                    <h1>Web form</h1>
                    {user.form && (
                        <iframe
                            ref={iframeRef}
                            frameBorder="0"
                            width="100%"
                            src={user.form}
                            onLoad={() => {
                                const self = iframeRef.current;
                                if (self) {
                                    self.style.height = iframeHeight + "px";
                                }
                            }}
                        />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default WebForm;
