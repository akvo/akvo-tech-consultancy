import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import request from "../utils/request";

const Login = function() {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const handleSubmit = async function(e) {
        e.preventDefault();
        await request().get("/sanctum/csrf-cookie");
        await request().post("/login", {
            email,
            password,
            remember
        });
        history.push("/webform");
    };
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card>
                        <Card.Header>Login</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        onChange={e => setEmail(e.target.value)}
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
                                        onChange={e =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Password"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        onChange={e =>
                                            setRemember(e.target.checked)
                                        }
                                        label="Remember Login"
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={7}>
                                        <Button variant="success" type="submit">
                                            Submit
                                        </Button>
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
