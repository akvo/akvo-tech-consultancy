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
    const youtubeLink = "https://www.youtube.com/embed/rCL0IAbchd8";
    const slideLink = "#";
    let content = hc(handleShow, youtubeLink, slideLink);
        content = content[locale.active];
    let gsContent = content.gettingStarted;
    let text = uiText[locale.active];
    const host = window.location.hostname.split('.').slice(-2)[0];

    const renderGsParagraph = (texts) => {
        return texts.map((x, i) => {
            return <p key={"p-"+i}>{x}</p>;
        })
    };

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

        { (host === "cocoamonitoring") ? "" : (
            <Container fluid className="mt-5 gettingStarted">
                <Row className="mt-5">
                    <Col md="12" className="mt-5 text-center gsText">
                        <h1>{gsContent.h}</h1>
                        {renderGsParagraph(gsContent.p1)}
                        <iframe
                            className="mt-3 mb-3"
                            src={youtubeLink}
                            width="700px"
                            height="400px"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen></iframe>
                        {renderGsParagraph(gsContent.p2)}
                    </Col>
                </Row>
            </Container>
        ) }

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
