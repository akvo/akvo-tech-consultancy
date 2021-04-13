import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { uiText } from "../static/ui-text";
import { useLocale } from "../lib/locale-context";
import { useAuth } from "../components/auth-context";
import useForm from "../lib/use-form";

const Login2 = () => {
    const { locale } = useLocale();
    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        errors,
        setServerErrors
    } = useForm();

    let text = uiText[locale.active];

    const onSubmit = async data => {
        try {
            await login(data);
            // setCache();
            history.push(config.userLanding);
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
        <Container className="authPg">
            <Row className="justify-content-md-center align-items-center" style={{'marginTop': '150px'}}>
                <Col md={6}>
                    <h2>{ text.welcome2 }</h2>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <img src="/images/beyond.jpg" alt="Beyond Chocolate" />
                        </Col>
                        <Col md={6}>
                            <img src="/images/gisco.jpg" alt="German Initiative on Sustainable Cocoa" />
                        </Col>
                    </Row>
                </Col>
                <Col md={6}
               >
                    <Row className="justify-content-md-end" style={{'fontSize': '0.9rem'}}
                    >
                        <Col md={3}>
                            Log in
                        </Col>
                        <Col md={7} style={{'textAlign': 'right'}}>
                            { text.formDontHaveAccount }&nbsp;<Link to="/register" >{ text.formRegister }</Link>
                        </Col>
                    </Row>
                    <Form
                        noValidate
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Row className="justify-content-md-end" style={{'marginTop': '20px'}}>
                            <Col md={10}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder={ text.formEmail }
                                        isInvalid={!!errors.email}
                                        ref={register({
                                            required: text.valEmail
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!!errors.email &&
                                         errors.email.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-end">
                            <Col md={10}>
                                <Form.Group controlId="formBasicPassword">
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder={ text.formPwd }
                                            isInvalid={!!errors.password}
                                            ref={register({
                                                required: text.valPwd
                                            })}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {!!errors.password &&
                                                errors.password.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-end">
                            <Col md={10}>
                                <Button type="submit" block>
                                    { text.formLogin }
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row className="justify-content-md-end" style={{'marginTop': '40px', 'fontSize': '0.9rem'}}>
                        <Col md={10}>
                            <Link to="/forgot-password">{ text.formForgotPwd }</Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Login2;
