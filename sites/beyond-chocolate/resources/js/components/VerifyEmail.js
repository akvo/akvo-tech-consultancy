import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useAuth } from "./auth-context";
import WelcomeBanner from "../components/WelcomeBanner";
import authApi from "../services/auth";

const VerifyEmail = () => {
    const { logout } = useAuth();
    const [resent, setResent] = useState();
    const handleResend = async () => {
        try {
            await authApi.resendVerificationEmail();
            setResent(true);
        } catch {}
    };
    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    return (
        <>
            <WelcomeBanner />
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <div className="mb-4">
                                    Thanks for signing up! Before getting
                                    started, could you verify your email address
                                    by clicking on the link we just emailed to
                                    you? If you didn't receive the email, we
                                    will gladly send you another.
                                </div>
                                {resent && (
                                    <div className="mb-4">
                                        A new verification link has been sent to
                                        the email address you provided during
                                        registration.
                                    </div>
                                )}
                                <Row>
                                    <Col md={7}>
                                        <Button
                                            variant="primary"
                                            onClick={handleResend}
                                        >
                                            Resend Verification Email
                                        </Button>
                                    </Col>
                                    <Col md={5} className="text-right">
                                        <Button
                                            variant="link"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default VerifyEmail;
