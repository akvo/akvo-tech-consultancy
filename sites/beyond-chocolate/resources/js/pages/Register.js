import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import WelcomeBanner from "../components/WelcomeBanner";
import useForm from "../lib/use-form";
import authApi from "../services/auth";
import config from "../config";
import Select from "react-select";
import { uiText } from "../static/ui-text";
import { useLocale } from "../lib/locale-context";

const RegisterForm = ({ text, setRegistered, organizations }) => {
    const {
        register,
        handleSubmit,
        errors,
        setServerErrors,
        reset,
        watch
    } = useForm();

    const [selectedOrgs, setSelectedOrgs] = useState({value:false, label:"", error: false});
    const password = useRef({});
    password.current = watch("password", "");

    const onSubmit = async data => {
        if (!selectedOrgs.value) {
            setSelectedOrgs({ ...selectedOrgs, error: true});
            return;
        }
        data = { ...data, organization_id: selectedOrgs.value };
        try {
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

    const renderOrganizations = organizations => {
        return organizations.map(x => {
            return { value: x.id, label: x.name };
        });
    };

    return (
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formBasicFulltName">
                <Form.Label>{ text.formFullName }</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    placeholder={ text.formFullName }
                    isInvalid={!!errors.name}
                    ref={register({
                        required: "The full name field is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {!!errors.name && errors.name.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>{ text.formEmail }</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder={ text.formEmail }
                    isInvalid={!!errors.email}
                    ref={register({
                        required: "The email field is required.."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {!!errors.email && errors.email.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                    { text.formEmailText }
                </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>{ text.formPwd }</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    placeholder={ text.formPwd }
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
                <Form.Label>{ text.formConfirmPwd }</Form.Label>
                <Form.Control
                    type="password"
                    name="password_confirmation"
                    placeholder={ text.formConfirmPwd }
                    isInvalid={!!errors.password_confirmation}
                    ref={register({
                        validate: value =>
                            value === password.current ||
                            "The passwords do not match."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {!!errors.password_confirmation &&
                        errors.password_confirmation.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicOrganization">
                <Form.Label>{ text.tbColOrganization }</Form.Label>
                <Select 
                    onChange={opt => setSelectedOrgs(opt)}
                    options={renderOrganizations(organizations)}
                />
                { selectedOrgs.error ? ( 
                    <Form.Text className="text-danger">
                        Select one of Organization.
                    </Form.Text>
                    ) : ""}
            </Form.Group>
            <Row>
                <Col md={12}>
                    <Button type="submit">{ text.formRegister }</Button>
                </Col>
            </Row>
        </Form>
    );
};

const RegisteredBanner = () => {
    useEffect(() => {
        setTimeout(() => window.location.reload(), 3000);
    }, []);

    return <div>Congratulations, you have been registered.</div>;
};

const Register = () => {
    const [registered, setRegistered] = useState(false);
    const [orgs, setOrgs] = useState([]);

    const { locale } = useLocale();
    let text = uiText[locale.active];

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
                            <Card.Header>{ text.formRegister }</Card.Header>
                            <Card.Body>
                                {registered ? (
                                    <RegisteredBanner />
                                ) : (
                                    <RegisterForm
                                        text={text}
                                        setRegistered={setRegistered}
                                        organizations={orgs}
                                    />
                                )}
                            </Card.Body>
                            {!registered && (
                                <Card.Footer>
                                    { text.formHaveAccount }
                                    <Link
                                        to={config.routes.login}
                                        className="ml-2"
                                    >
                                        { text.formLogin }
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
