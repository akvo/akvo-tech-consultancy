import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
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
        <>
        <Container fluid className="homeLanding">
            <Row>
                <div className="introTxt">
                    <h1 className="text-center">{ content.h }</h1>
                    <p>
                        <span>{ content.p1 }</span> <br />
                        { content.p2 }
                    </p>
                    <Button
                        className="introStartBtn"
                        as={Link}
                        variant="primary"
                        to={config.routes.survey}
                    >
                        { text.btnStartSurvey }
                    </Button>
                </div>
            </Row>
        </Container>

        {/* <Container fluid className="mt-5">
            <Row className="mt-5">
                <Col md="12" className="mt-5 text-center">
                    <h1>Getting Started</h1>
                    <p>For in-depth info, please watch the video at this <a href="#">link</a> (or watch it directly below).</p>
                    <p>You should also visit our <a href="/faq">FAQ section</a> which contain answers to most questions.</p>
                    <iframe 
                        className="mt-3 mb-3"
                        src="https://www.youtube.com/embed/X48VuDVv0doXXX" 
                        width="600px" 
                        height="320px"
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen></iframe>
                    <p>We also prepare a <a href="#">slide</a>, describing the tool functionalities.</p>
                    <p>If you need any more info, don't hesitate to get in touch directly: <a href="/feedback">feedback form</a></p>
                </Col>
            </Row>
        </Container> */}

        <ModalDataSecurity
            text={text}
            show={show}
            handleClose={handleClose}
            locale={locale}
            data={dsc}
        />
        </>
    );
};

export default Home;
