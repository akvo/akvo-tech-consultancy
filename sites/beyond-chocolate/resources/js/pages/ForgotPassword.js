import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import WelcomeBanner from "../components/WelcomeBanner";
import { Link } from "react-router-dom";
import useForm from "../lib/use-form";
import authApi from "../services/auth";

const ForgotPasswordForm = ({ setSuccess }) => {
    const {
        register,
        handleSubmit,
        errors,
        setServerErrors,
        reset
    } = useForm();
    const [error, setError] = useState({status: false, message: ""});

    const onSubmit = async data => {
        try {
            const res = await authApi.forgotPassword(data);
            reset();
            setSuccess(res.data.message);
            setError({status: false, message: ""});
        } catch (e) {
            if (e.status === 401) {
                setError({status: true, message: e.data.message});
            }
            if (e.status === 422) {
                setServerErrors(e.errors);
            } else {
                throw e;
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    onChange={e => setError({status: false, message: ""})}
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    isInvalid={!!errors.email}
                    ref={register({
                        required: "The email field is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {!!errors.email && errors.email.message}
                </Form.Control.Feedback>
                {
                    error.status && (
                        <Form.Text className="text-danger">
                            { error.message }
                        </Form.Text>
                    )
                }
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
            <Button type="submit">Send Email</Button>
        </Form>
    );
};

const SuccessBanner = ({ message }) => {
    return <div>{message}</div>;
};

const ForgotPassword = () => {
    const [success, setSuccess] = useState();

    return (
        <>
            <WelcomeBanner />
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card>
                            <Card.Header>Forgot Password</Card.Header>
                            <Card.Body>
                                {success ? (
                                    <SuccessBanner message={success} />
                                ) : (
                                    <ForgotPasswordForm
                                        setSuccess={setSuccess}
                                    />
                                )}
                            </Card.Body>
                            {!success && (
                                <Card.Footer>
                                    Don't have any account?
                                    <Link to="/register" className="ml-2">
                                        Register
                                    </Link>
                                </Card.Footer>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ForgotPassword;
