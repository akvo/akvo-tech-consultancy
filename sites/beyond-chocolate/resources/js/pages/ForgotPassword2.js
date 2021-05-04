import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import WelcomeBanner from "../components/WelcomeBanner";
import { Link } from "react-router-dom";
import useForm from "../lib/use-form";
import authApi from "../services/auth";
import { useLocale } from "../lib/locale-context";
import { uiText } from "../static/ui-text";
import AuthBrand from "../components/AuthBrand.js";

const ForgotPasswordForm = ({ text, setSuccess }) => {
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
                <Form.Control
                    onChange={e => setError({status: false, message: ""})}
                    type="email"
                    name="email"
                    placeholder={ text.formEmail }
                    isInvalid={!!errors.email}
                    ref={register({
                        required: text.valEmail
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
            </Form.Group>
            <Button type="submit" block>{ text.btnSendEmail }</Button>
        </Form>
    );
};

const ForgotPassword2 = () => {
    const [success, setSuccess] = useState();
    const { locale } = useLocale();
    let text = uiText[locale.active];

    return (
      <>
      <WelcomeBanner />

        <Container className="authPg">
            <Row className="justify-content-md-center align-items-center" style={{'marginTop': '100px'}}>
                <AuthBrand text={text}/>
                <Col md={6}>
                    {success === undefined ? (
                        <>
                        <Row className="justify-content-md-end" style={{'fontSize': '0.9rem'}}>
                            <Col md={4}>
                                { text.formForgotPwd }
                            </Col>
                            <Col md={6} style={{'textAlign': 'right'}}>
                                { text.formDontHaveAccount }&nbsp;<Link to="/register" >{ text.formRegister }</Link>
                            </Col>
                        </Row>
                        <Row className="justify-content-md-end" style={{'marginTop': '20px'}}>
                            <Col md={10}>
                                <ForgotPasswordForm
                                    text={text}
                                    setSuccess={setSuccess}
                                />
                            </Col>
                        </Row>
                        </>
                    ) : (
                        <Row className="justify-content-md-end" style={{'marginTop': '20px'}}>
                            <Col md={10}>
                                {success}
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
      </>
    );
};

export default ForgotPassword2;
