import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import * as qs from "query-string";
import useForm from "../lib/use-form";
import authApi from "../services/auth";
import WelcomeBanner from "../components/WelcomeBanner";
import { uiText } from "../static/ui-text";
import { useLocale } from "../lib/locale-context";
import AuthBrand from "../components/AuthBrand.js";

const ResetPasswordForm = ({ text, email, token, setSuccess }) => {
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
                <Form.Control
                    type="password"
                    name="password"
                    placeholder={ text.formNewPwd }
                    isInvalid={!!errors.password}
                    ref={register({
                        required: text.valNewPwd
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {!!errors.password && errors.password.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicConfirmPassword">
                <Form.Control
                    type="password"
                    name="password_confirmation"
                    placeholder={ text.formConfirmPwd }
                    isInvalid={!!errors.password_confirmation}
                    ref={register({
                        validate: value => value === password.current
                        || text.valPwdNotMatch
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {!!errors.password_confirmation &&
                        errors.password_confirmation.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" block>{ text.btnUpdate }</Button>
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

const ResetPassword2 = () => {
    const location = useLocation();
    const { token } = useParams();
    const { email } = qs.parse(location.search);
    const [success, setSuccess] = useState();
    const { locale } = useLocale();
    let text = uiText[locale.active];

    return (
            <Container className="authPg">
                <Row className="justify-content-md-center align-items-center" style={{'marginTop': '150px'}}>
                    <AuthBrand text={text}/>

                    <Col md={6}>
                        {success === undefined ? (
                            <>
                                <Row className="justify-content-md-end" style={{'fontSize': '0.9rem'}}>
                                    <Col md={10}>
                                        { text.formResetPwd }
                                    </Col>
                                </Row>
                                <Row className="justify-content-md-end" style={{'marginTop': '20px'}}>
                                    <Col md={10}>
                                        <ResetPasswordForm
                                            text={text}
                                            email={email}
                                            token={token}
                                            setSuccess={setSuccess}
                                        />
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <Row className="justify-content-md-end" style={{'marginTop': '20px'}}>
                                <Col md={10}>
                                    <SuccessBanner message={success} />
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
            </Container>
    );
};

export default ResetPassword2;
