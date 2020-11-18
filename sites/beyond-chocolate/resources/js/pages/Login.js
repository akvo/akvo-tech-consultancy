import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Login = function() {
    return (
        <Container fluid>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card>
                        <Card.Header>Login</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                    />
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone
                                        else.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        label="Remember Login"
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={7}>
                                        <Link to="/users">
                                            <Button
                                                variant="success"
                                                type="submit"
                                            >
                                                Submit
                                            </Button>
                                        </Link>
                                    </Col>
                                    <Col md={5} className="text-right">
                                        <a href="#">
                                            <FontAwesomeIcon
                                                className="mr-2"
                                                icon={faKey}
                                            />
                                            Forgot Password
                                        </a>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                        <Card.Footer>
                            Don't have any account?
                            <a href="#" className="ml-2">
                                Register
                            </a>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
