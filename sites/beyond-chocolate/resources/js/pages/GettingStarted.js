import React, { useEffect, Fragment } from "react";
import { Container, Row, Col, Card, Tabs, Tab } from "react-bootstrap";
import { useLocale } from "../lib/locale-context";
import { gsc } from "../static/getting-started-content";

const GettingStarted = () => {
    const { locale } = useLocale();
    const content = gsc[locale.active];

    const renderIframe = (data) => {
        return data.map((x,i) => {
            return (
                <Tab key={"tabs-"+i} eventKey={"tab-"+i} title={x.tab}>
                    {
                        (x.body === "document") ?
                            <iframe 
                                className="mt-4"
                                src="/uploads/media/default/0001/01/540cb75550adf33f281f29132dddd14fded85bfc.pdf" 
                                width="100%" 
                                frameBorder="0" 
                                height="700px"></iframe>
                        : (x.body === "video") ?
                            <iframe 
                                className="mt-4"
                                src="https://www.youtube.com/embed/X48VuDVv0doXXX" 
                                width="100%" 
                                height="700px"
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen></iframe>
                        : ""
                    }
                </Tab>
            )
        });
    };
    
    const renderRightCards = (data) => {
        return data.map((x,i) => {
            return (
                <Card className={(i!==0) ? "mt-4" : ''} key={"gs-many-"+i}>
                    <Card.Header>
                        <h5>{x.title}</h5>
                    </Card.Header>
                    <Card.Body>
                        {x.body}
                    </Card.Body>
                </Card>
            );
        });
    };

    const renderContent = () => {
        return (
            <Row>
                <Col md="9">
                    <Card key={"gs-single"}>
                        <Card.Header>
                            <h5>{content.single.title}</h5>
                        </Card.Header>
                        <Card.Body>
                            <Tabs
                                id="tools-tabs"
                                defaultActiveKey="tab-0"
                            >
                                {renderIframe(content.single.body)}
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="3">
                    {renderRightCards(content.many)}
                </Col>
            </Row>
        );
    };

    return (
        <Container fluid>
            {renderContent()}
        </Container>
    );
};

export default GettingStarted;
