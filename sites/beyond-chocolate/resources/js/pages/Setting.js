import React, { useState, useEffect } from "react";
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

const SettingForm = ({ email, setSuccess, invalidPwd, setInvalidPwd }) => {
    const {
        register,
        handleSubmit,
        errors,
        setServerErrors,
        reset,
    } = useForm();

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

    // useEffect(() => {
    //     console.log(errors);
    // }, [invalidPwd]);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Card.Body>
                {/* Email */}
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder={email} readOnly />
                    <Form.Text className="text-muted">We'll never share your email address with anyone else.</Form.Text>
                </Form.Group>
                {/* Password */}
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="password"
                        placeholder="Old Password" 
                        isInvalid={!!errors.password}
                        ref={register}
                        required />
                    <Form.Control.Feedback type="invalid">
                        {!!errors.password &&
                            errors.password.message && 
                            !errors.password.message.includes('confirmation')}
                    </Form.Control.Feedback>
                    {invalidPwd ? (
                        <Form.Text key='invalidpwd' className="text-danger">
                            {invalidPwd}
                        </Form.Text>
                    ) : ""}
                </Form.Group>
                {/* New Password */}
                <Form.Group controlId="formBasicNewPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="new_password"
                        placeholder="New Password" 
                        isInvalid={!!errors.new_password}
                        ref={register}
                        required />
                    <Form.Control.Feedback type="invalid">
                        {!!errors.new_password &&
                            errors.new_password.message}
                    </Form.Control.Feedback>
                </Form.Group>
                {/* New Password Confirmation */}
                <Form.Group controlId="formBasicConfirmNewPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="new_password_confirmation"
                        placeholder="New Password" 
                        isInvalid={!!errors.new_password_confirmation}
                        ref={register}
                        required />
                    <Form.Control.Feedback type="invalid">
                        {!!errors.new_password_confirmation &&
                            errors.new_password_confirmation.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Card.Body>
            <Card.Footer>
                <Button variant="primary" type="submit" block>
                    Update
                </Button>
            </Card.Footer>
        </Form>
    );
};

const SuccessBanner = ({ message, logout }) => {
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
    
    return (
        <Container fluid>
            <Row>
                <Col className="mx-auto" md={6}>
                    <Card>
                        <Card.Header>Change Password</Card.Header>
                        { success ? (
                            <SuccessBanner message={success} logout={logout} />
                        ) : (
                            <SettingForm 
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