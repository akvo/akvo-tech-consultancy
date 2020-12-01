import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
import WelcomeBanner from "../components/WelcomeBanner";
import { useAuth } from "../components/auth-context";
import useForm from "../lib/use-form";
import config from "../config";

const Login = ({ location }) => {
    const history = useHistory();
    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        errors,
        setServerErrors
    } = useForm();
    const onSubmit = async data => {
        try {
            await login(data);
            history.push(
                location?.state?.referrer?.pathname || config.userLanding
            );
        } catch (e) {
            if (e.status === 422 || e.status === 429) {
                setServerErrors(e.errors);
                setValue("password", "", { shouldDirty: true });
            } else {
                throw e;
            }
        }
    };

    return (
        <>
            <WelcomeBanner />
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card>
                            <Card.Header>Login</Card.Header>
                            <Card.Body>
                                <Form
                                    noValidate
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Enter email"
                                            isInvalid={!!errors.email}
                                            ref={register}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {!!errors.email &&
                                                errors.email.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            isInvalid={!!errors.password}
                                            ref={register}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {!!errors.password &&
                                                errors.password.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check
                                            type="checkbox"
                                            name="remember"
                                            label="Remember Login"
                                            ref={register}
                                        />
                                    </Form.Group>
                                    <Row>
                                        <Col md={7}>
                                            <Button type="submit">
                                                Submit
                                            </Button>
                                        </Col>
                                        <Col md={5} className="text-right">
                                            <Link to="/forgot-password">
                                                <FontAwesomeIcon
                                                    className="mr-2"
                                                    icon={faKey}
                                                />
                                                Forgot Password
                                            </Link>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                            <Card.Footer>
                                Don't have any account?
                                <Link to="/register" className="ml-2">
                                    Register
                                </Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Login;
