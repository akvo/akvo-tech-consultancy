import React, { useEffect, Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocale } from "../lib/locale-context";
import { faq } from "../static/faq-content";

const Faq = () => {
    const { locale } = useLocale();
    let content = faq[locale.active];
    const renderFaq = () => {
        let data = faq[locale.active];
        return data.map((x,idx) => {
            return (
                <Fragment key={"fr-"+idx}>
                <dt key={"dt-"+idx}>{idx + 1}. {x.h}</dt>
                <dd key={"dd-"+idx}>{x.c}</dd>
                </Fragment>
            )
        });
    };

    useEffect(() => {
        renderFaq();
    }, [locale]);

    return (
        <Container fluid>
            <Row className="faqList">
                <Col>
                    <dl>
                        {renderFaq()}
                    </dl>
                </Col>
            </Row>
        </Container>
    );

};

export default Faq;
