import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import useForm from "../lib/use-form";
import emailApi from "../services/email";
import { useAuth } from "../components/auth-context";
import { useLocale } from "../lib/locale-context";

const Feedback = () => {
    const { user, logout } = useAuth();
    const {
        register,
        handleSubmit,
        errors,
        setServerErrors,
        reset,
    } = useForm();

    const [captchaNumber, setCaptchaNumber] = useState(0);
    const [emailStatus, setEmailStatus] = useState(false);
    const [emailMessage, setEmailMessage] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const updateValidator = () => {
        let captchaDiv = document.getElementById("captcha-number");
        if (captchaDiv.hasChildNodes()) {
            captchaDiv.removeChild(captchaDiv.lastChild);
        }
        let validatorX = Math.floor(Math.random() * 9) + 1;
        let validatorY = Math.floor(Math.random() * 9) + 1;
        var canv = document.createElement("canvas");
        canv.width = 100;
        canv.height = 50;
        let ctx = canv.getContext("2d");
        ctx.font = "25px Georgia";
        ctx.strokeText(validatorX + "+" + validatorY, 0, 30);
        setCaptchaNumber(validatorX + validatorY);
        captchaDiv.appendChild(canv);
    }

    useEffect(() => {
        updateValidator();
    }, [emailStatus]);
    
    const onSubmit = async (data, e) => {
        if (captchaNumber !== parseInt(data.captcha)) {
            updateValidator();
            return;
        }

        setLoading(true);
        try {
            let sendData = {
                email: user.email,
                subject: data.title,
                message: data.feedback,
            }
            let res = await emailApi.sendEmail(sendData);
            let status = (res.data.sent !== false) ? true : false;
            setEmailStatus(status);
            setEmailMessage("Something wrong, please try again!");
            setLoading(false);
            status ? e.target.reset() : "";
            
        } catch (e) {
            if (e.status === 422 || e.status === 429) {
                setServerErrors(e.errors);
            } else {
                throw e;
            }
            setLoading(false);
        }
    };

    return (
        <Container fluid>
            <Row className="definitionList">
                <Col md={6} className="mx-auto">
                    <Card>
                        <Card.Header>Send your Feedback</Card.Header>
                        <Card.Body>
                            { emailStatus ? (
                                <div className="alert alert-success">
                                    <strong>Your message has been successfully sent!</strong>
                                </div>
                            ) : "" }
                            <Form onSubmit={handleSubmit(onSubmit)} >
                                <Form.Group controlId="formTitle">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        placeholder="Enter title"
                                        isInvalid={!!errors.title}
                                        ref={register}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!!errors.title &&
                                            errors.title.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formBasicFeedback">
                                    <Form.Label>Feedback</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="feedback"
                                        rows="4"
                                        isInvalid={!!errors.feedback}
                                        ref={register}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!!errors.feedback &&
                                            errors.feedback.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <div id="captcha-number"></div>
                                    <Form.Control
                                        type="number"
                                        name="captcha"
                                        placeholder="Enter Value"
                                        isInvalid={!!errors.captcha}
                                        ref={register}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {!!errors.captcha &&
                                            errors.captcha.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button
                                    variant={isLoading ? "secondary" : "primary"} 
                                    disabled={isLoading}
                                    type="submit"
                                >
                                    {isLoading ? 'Loading…' : 'Submit'}
                                </Button>
                                { !emailStatus && emailMessage !== false
                                    ? (<Form.Text className="text-danger">{emailMessage}</Form.Text>)
                                    : ""
                                }
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Feedback;
