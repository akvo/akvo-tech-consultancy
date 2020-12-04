import React, { useState, useEffect, useRef } from "react";
import { 
    Container, 
    Row, 
    Col, 
    Card, 
    Form, 
    Button 
} from "react-bootstrap";
import useForm from "../lib/use-form";
import { useAuth } from "../components/auth-context";
import authApi from "../services/auth";
import { useHistory } from "react-router-dom";
import { useLocale } from "../lib/locale-context";
import { uiText } from "../static/ui-text";

const SettingForm = ({ text, email, setSuccess, invalidPwd, setInvalidPwd }) => {
    const {
        register,
        handleSubmit,
        errors,
        setServerErrors,
        reset,
        watch
    } = useForm();

    const password = useRef({});
    password.current = watch("new_password", "");

    const onSubmit = async data => {
        try {
            const res = await authApi.updatePassword({ ...data });
            if (res.status === 200) {
                setSuccess(res.data.message);
                reset();
            }
        } catch (e) {
            // set error when old passwordn doesn't match with user typing
            if (e.status === 401) {
                setInvalidPwd(e.data.message);
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
            <Card.Body>
                {/* Email */}
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>{ text.formEmail }</Form.Label>
                    <Form.Control type="email" name="email" placeholder={email} readOnly />
                    <Form.Text className="text-muted">{ text.formEmailText }</Form.Text>
                </Form.Group>
                {/* Password */}
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>{ text.formOldPwd }</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="password"
                        placeholder={ text.formOldPwd } 
                        isInvalid={!!errors.password}
                        ref={register({
                            required: text.valOldPwd
                        })} 
                    />
                    <Form.Control.Feedback type="invalid">
                        {!!errors.password &&
                            errors.password.message}
                    </Form.Control.Feedback>
                    {invalidPwd ? (
                        <Form.Text key='invalidpwd' className="text-danger">
                            {invalidPwd}
                        </Form.Text>
                    ) : ""}
                </Form.Group>
                {/* New Password */}
                <Form.Group controlId="formBasicNewPassword">
                    <Form.Label>{ text.formNewPwd }</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="new_password"
                        placeholder={ text.formNewPwd }
                        isInvalid={!!errors.new_password}
                        ref={register({
                            required: text.valNewPwd
                        })} 
                    />
                    <Form.Control.Feedback type="invalid">
                        {!!errors.new_password &&
                            errors.new_password.message}
                    </Form.Control.Feedback>
                </Form.Group>
                {/* New Password Confirmation */}
                <Form.Group controlId="formBasicConfirmNewPassword">
                    <Form.Label>{ text.formConfirmNewPwd }</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="new_password_confirmation"
                        placeholder={ text.formConfirmNewPwd } 
                        isInvalid={!!errors.new_password_confirmation}
                        ref={register({
                            validate: value => value === password.current || text.valPwdNotMatch
                        })} 
                    />
                    <Form.Control.Feedback type="invalid">
                        {!!errors.new_password_confirmation &&
                            errors.new_password_confirmation.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Card.Body>
            <Card.Footer>
                <Button variant="primary" type="submit" block>
                    {  text.btnUpdate }
                </Button>
            </Card.Footer>
        </Form>
    );
};

const SuccessBanner = ({ message, logout }) => {
    const history = useHistory();
    useEffect(() => {
        setTimeout(async () => {
            await logout();
            window.location.reload();
        }, 2000);
    }, [message]);
    return (
        <Card.Body>
            <div>{message}</div>
        </Card.Body>
    );
};

const Setting = () => {
    const { user, logout } = useAuth();
    const [success, setSuccess] = useState();
    const [invalidPwd, setInvalidPwd] = useState();
    const { locale } = useLocale();
    let text = uiText[locale.active];

    return (
        <Container fluid>
            <Row>
                <Col className="mx-auto" md={6}>
                    <Card>
                        <Card.Header>{ text.formChangePwd }</Card.Header>
                        { success ? (
                            <SuccessBanner message={success} logout={logout} />
                        ) : (
                            <SettingForm 
                                text={text}
                                email={user.email}
                                setSuccess={setSuccess}
                                invalidPwd={invalidPwd}
                                setInvalidPwd={setInvalidPwd} />
                        ) }
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Setting;