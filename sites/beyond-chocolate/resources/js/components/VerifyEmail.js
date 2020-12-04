import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useAuth } from "./auth-context";
import WelcomeBanner from "../components/WelcomeBanner";
import authApi from "../services/auth";
import { uiText } from "../static/ui-text";
import { useLocale } from "../lib/locale-context";

const VerifyEmail = () => {
    const { logout } = useAuth();
    const [resent, setResent] = useState();

    const { locale } = useLocale();
    let text = uiText[locale.active];

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
                                    { text.valVerificationThank }
                                </div>
                                {resent && (
                                    <div className="mb-4">
                                        { text.valVerificationInfo }
                                    </div>
                                )}
                                <Row>
                                    <Col md={7}>
                                        <Button
                                            variant="primary"
                                            onClick={handleResend}
                                        >
                                            { text.btnResendVerificationEmail }
                                        </Button>
                                    </Col>
                                    <Col md={5} className="text-right">
                                        <Button
                                            variant="link"
                                            onClick={handleLogout}
                                        >
                                            { text.navLogout }
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
