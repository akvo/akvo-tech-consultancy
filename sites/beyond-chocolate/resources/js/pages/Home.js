import React from "react";
import { Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import config from "../config";
import { useLocale } from "../lib/locale-context";
import { hc } from "../static/home-content";

const Home = () => {
    const { locale } = useLocale();
    let content = hc[locale.active];

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
                        Click here to start the survey
                    </Button>
                </div>
            </Row>
        </Container>
    );
};

export default Home;
