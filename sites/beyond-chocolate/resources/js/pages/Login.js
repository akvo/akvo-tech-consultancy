import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
import WelcomeBanner from "../components/WelcomeBanner";
import { useAuth } from "../components/auth-context";
import useForm from "../lib/use-form";
import config from "../config";
import { uiText } from "../static/ui-text";
import { useLocale } from "../lib/locale-context";

const Login = () => {
    const history = useHistory();
    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        errors,
        setServerErrors
    } = useForm();

    const { locale } = useLocale();
    let text = uiText[locale.active];

    // const setCache = () => {
    //     // set login time
    //     const now = new Date();
    //     let cache_version = document.getElementsByName("cache-version")[0].getAttribute("value");
    //     localStorage.clear();
    //     localStorage.setItem("cache-time", now.getTime());
    //     localStorage.setItem("cache-version", cache_version);
    // };

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
        <>
            <WelcomeBanner />
            <Container className="loginPg">
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card>
                            <Card.Header>{ text.formLogin }</Card.Header>
                            <Card.Body>
                                <Form
                                    noValidate
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>{ text.formEmail }</Form.Label>
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
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>{ text.formPassword }</Form.Label>
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
                                    {/* <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check
                                            type="checkbox"
                                            name="remember"
                                            label={ text.formRememberLogin }
                                            ref={register}
                                        />
                                    </Form.Group> */}
                                    <Row>
                                        <Col md={7}>
                                            <Button type="submit">
                                                { text.btnSubmit }
                                            </Button>
                                        </Col>
                                        <Col md={5} className="text-right">
                                            <Link to="/forgot-password">
                                                <FontAwesomeIcon
                                                    className="mr-2"
                                                    icon={faKey}
                                                />
                                                { text.formForgotPwd }
                                            </Link>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                            <Card.Footer>
                                { text.formDontHaveAccount }
                                <Link to="/register" className="ml-2">
                                    { text.formRegister }
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
