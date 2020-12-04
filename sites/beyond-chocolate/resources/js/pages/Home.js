import React, { useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import config from "../config";
import { useLocale } from "../lib/locale-context";
import { hc } from "../static/home-content";
import { ModalDataSecurity } from "../components/Modal";
import { dsc } from "../static/data-security-content";
import { uiText } from "../static/ui-text";

const Home = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { locale } = useLocale();
    let content = hc(handleShow);
        content = content[locale.active];
    let text = uiText[locale.active];
        
    return (
        <Container fluid className="homeLanding">
            <Row>
                <div className="introTxt">
                    <h1>{ content.h }</h1>
                    <p>
                        <span>{ content.p1 }</span> <br />
                        { content.p2 }
                    </p>
                    <Button
                        as={Link}
                        variant="primary"
                        to={config.routes.survey}
                    >
                        { text.btnStartSurvey }
                    </Button>
                </div>
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

export default Home;
