import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import WelcomeBanner from "../components/WelcomeBanner";
import useForm from "../lib/use-form";
import authApi from "../services/auth";
import config from "../config";

const RegisterForm = ({ setRegistered, organizations }) => {
    const {
        register,
        handleSubmit,
        errors,
        setServerErrors,
        reset, 
        watch
    } = useForm();

    const password = useRef({});
    password.current = watch("password", "");
    
    const onSubmit = async data => {
        try {
            // where this endpoint goes to?
            await authApi.register(data);
            setRegistered(true);
            reset();
        } catch (e) {
            if (e.status === 422) {
                setServerErrors(e.errors);
            } else {
                throw e;
            }
        }
    };

    const renderOrganizations = (organizations) => {
        return organizations.map((x, index) => {
            return <option key={index} value={x.id}>{x.name}</option>
        });
    };

    return (
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formBasicFulltName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    isInvalid={!!errors.name}
                    ref={register({
                        required: "Please enter you full name."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {!!errors.name && errors.name.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    isInvalid={!!errors.email}
                    ref={register({
                        required: "Please enter you email."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {!!errors.email && errors.email.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    isInvalid={!!errors.password}
                    ref={register({
                        required: "You must specify a password."
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
            <Form.Group controlId="formBasicOrganization">
                <Form.Label>Organization</Form.Label>
                <Form.Control
                    as="select"
                    name="organization_id"
                    isInvalid={!!errors.organization_id}
                    ref={register({ required: "Select one of Organization." })}
                    custom >
                        <option key="defaultSelect" value="">Select Organization</option>
                        {renderOrganizations(organizations)}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                    {!!errors.organization_id &&
                        errors.organization_id.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Row>
                <Col md={12}>
                    <Button type="submit">Register</Button>
                </Col>
            </Row>
        </Form>
    );
};

const RegisteredBanner = () => {
    // TODO: remove when email activation has been implemented.
    useEffect(() => {
        setTimeout(() => window.location.reload(), 3000);
    }, []);

    return <div>Congratulations, you have been registered.</div>;
};

const Register = () => {
    const [registered, setRegistered] = useState(false);
    const [orgs, setOrgs] = useState([]);

    useEffect(async () => {
        try {
            let res = await authApi.getOrganizations();
            setOrgs(res.data);
        } catch (e) {
            throw e;
        }
    }, []);

    return (
        <>
            <WelcomeBanner />
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card>
                            <Card.Header>Register</Card.Header>
                            <Card.Body>
                                {registered ? (
                                    <RegisteredBanner />
                                ) : (
                                    <RegisterForm
                                        setRegistered={setRegistered}
                                        organizations={orgs}
                                    />
                                )}
                            </Card.Body>
                            {!registered && (
                                <Card.Footer>
                                    Already have account?
                                    <Link
                                        to={config.routes.login}
                                        className="ml-2"
                                    >
                                        Login
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

export default Register;
