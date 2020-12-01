import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import * as qs from "query-string";
import useForm from "../lib/use-form";
import authApi from "../services/auth";
import WelcomeBanner from "../components/WelcomeBanner";

const ResetPasswordForm = ({ email, token, setSuccess }) => {
    const {
        handleSubmit,
        register,
        errors,
        setServerErrors,
        reset,
        watch
    } = useForm();

    const password = useRef({});
    password.current = watch("password", "");

    const onSubmit = async data => {
        try {
            const res = await authApi.resetPassword({ ...data, token });
            setSuccess(res.data.message);
            reset();
        } catch (e) {
            if (e.status === 422) {
                setServerErrors(e.errors);
            } else {
                throw e;
            }
        }
    };

    return (
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    defaultValue={email}
                    placeholder="Enter email"
                    isInvalid={!!errors.email}
                    ref={register}
                />
                <Form.Control.Feedback type="invalid">
                    {!!errors.email && errors.email.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group> */}
            <Form.Group controlId="formBasicNewPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="New Password"
                    isInvalid={!!errors.password}
                    ref={register({
                        required: "The password field is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {!!errors.password && errors.password.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    isInvalid={!!errors.password_confirmation}
                    ref={register({
                        validate: value => value === password.current || "The passwords do not match."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {!!errors.password_confirmation &&
                        errors.password_confirmation.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit">Update</Button>
        </Form>
    );
};

const SuccessBanner = ({ message }) => {
    const history = useHistory();
    useEffect(() => {
        setTimeout(() => history.push("/"), 2000);
    }, []);
    return <div>{message}</div>;
};

const ResetPassword = () => {
    const location = useLocation();
    const { token } = useParams();
    const { email } = qs.parse(location.search);
    const [success, setSuccess] = useState();

    return (
        <>
            <WelcomeBanner />
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card>
                            <Card.Header>Reset Password</Card.Header>
                            <Card.Body>
                                {success ? (
                                    <SuccessBanner message={success} />
                                ) : (
                                    <ResetPasswordForm
                                        email={email}
                                        token={token}
                                        setSuccess={setSuccess}
                                    />
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ResetPassword;
