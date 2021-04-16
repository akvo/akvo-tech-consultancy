import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import authApi from "../services/auth";
import config from "../config";
import useForm from "../lib/use-form";
import { ModalDataSecurity } from "../components/Modal";
import { dsc } from "../static/data-security-content";
import { uiText } from "../static/ui-text";
import { useLocale } from "../lib/locale-context";
import { wfc } from "../static/webform-content";
import AuthBrand from "../components/AuthBrand.js";


const RegisterForm = ({ text, content, setRegistered, organizations, secretariats }) => {
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
    const [selectedSecretariat, setSelectedSecretariat] = useState({value: false, label:"", error: false});
    const [selectedOrgs, setSelectedOrgs] = useState({value:false, label:"", error: false});

    useEffect(() => {
        console.log('Update org list');
    }, [selectedSecretariat]);

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

    const renderSecretariats = secretariats => {
        return secretariats.map(secretariat => {
            return {
                value: secretariat.id,
                label: secretariat.name
            };
        });
    };

    return (
        <Row className="justify-content-md-end"
        >
            <Col md={10}>
                <Row style={{'fontSize': '0.9rem', 'marginBottom': '20px'}}>
                    <Col md={5}>
                        { text.formRegister }
                    </Col>
                    <Col md={7} style={{'textAlign': 'right'}}>
                        { text.formHaveAccount }&nbsp;
                        <Link to={config.routes.login}>
                            { text.formLogin }
                        </Link>
                    </Col>
                </Row>

                <Form noValidate onSubmit={handleSubmit(onSubmit)}>

                    <Form.Group controlId="formBasicFulltName">
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder={ text.formFullName }
                            isInvalid={!!errors.name}
                            ref={register({
                                required: text.valFullName
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {!!errors.name && errors.name.message}
                        </Form.Control.Feedback>
                    </Form.Group>
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
                            {!!errors.email && errors.email.message}
                        </Form.Control.Feedback>
                    </Form.Group>
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
                                validate: value =>
                                value === password.current ||
                                    text.valPwdNotMatch
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {!!errors.password_confirmation &&
                             errors.password_confirmation.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicSecretariats">
                        <Select
        // onChange={opt => setSelectedOrgs(opt)}
                            onChange={opt => setSelectedSecretariat(opt)}
                            options={renderSecretariats(secretariats)}
                            placeholder={ 'Secretariats' }
                        />
                        { selectedOrgs.error ? (
                            <Form.Text className="text-danger">
                                { text.valOrganization }
                            </Form.Text>
                        ) : ""}
                    </Form.Group>
                    <Form.Group controlId="formBasicOrganization">
                        <Select
                            onChange={opt => setSelectedOrgs(opt)}
                            options={renderOrganizations(organizations)}
                            placeholder={ text.tbColOrganization }
                        />
                        { selectedOrgs.error ? (
                            <Form.Text className="text-danger">
                                { text.valOrganization }
                            </Form.Text>
                        ) : ""}
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check
                            type="checkbox"
                            name="agreement"
                            label={ content.registerCheckBoxText }
        // isInvalid={!!errors.agreement}
                            ref={register({
                                required: text.valRegisterCheckBox
                            })}
                        />
                        {!!errors.agreement &&
                         errors.agreement.message ?
                         <Form.Text className="text-danger" style={{paddingLeft:"1.2rem"}}>
                             {errors.agreement.message}
                         </Form.Text>
                         : ""}
                    </Form.Group>
                    <Button type="submit" block>
                        { text.formRegister }
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};

const RegisteredBanner = ({ text }) => {
    useEffect(() => {
        setTimeout(() => window.location.reload(), 3000);
    }, []);

    return <div>{ text.valRegisterSuccess }</div>;
};

const Register2 = () => {
    const [registered, setRegistered] = useState(false);
    const [secretariats, setSecretariats] = useState([]);
    const [orgs, setOrgs] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { locale } = useLocale();
    let text = uiText[locale.active];
    let content = wfc(handleShow)[locale.active];

    useEffect(async () => {
        try {
            let res = await authApi.getSecretariats();
            setSecretariats(res.data);
        } catch (e) {
            throw e;
        }
    }, []);

    useEffect(async () => {
        try {
            let res = await authApi.getOrganizations();
            setOrgs(res.data);
        } catch (e) {
            throw e;
        }
    }, []);



    return (
        <Container className="authPg">
            <Row className="justify-content-md-center align-items-center" style={{'marginTop': '150px'}}>
                <AuthBrand text={text} />
                <Col md={6}>
                    {registered ? (
                        <RegisteredBanner text={text} />
                    ) : (
                        <RegisterForm
                            text={text}
                            content={content}
                            setRegistered={setRegistered}
                            secretariats={secretariats}
                            organizations={orgs}
                        />
                    )}
                </Col>
            </Row>
            <ModalDataSecurity
                text={text}
                show={show}
                handleClose={handleClose}
                locale={locale}
                data={dsc}
            />
        </Container>
    );
};

export default Register2;
