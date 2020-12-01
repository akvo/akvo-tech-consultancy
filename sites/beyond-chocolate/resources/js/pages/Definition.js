import React, { useEffect, Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocale } from "../lib/locale-context";
import { defs } from "../static/definition-content";
import sortBy from "lodash/sortBy";

const Definition = () => {
    const { locale } = useLocale();

    const renderDefinition = () => {
        let data = defs[locale.active];
        data = sortBy(data, ['i']);
        return data.map((x,idx) => {
            return (
                <Fragment key={"fr-"+idx}>
                <dt key={"dt-"+idx}>{x.t}</dt>
                <dd key={"dd-"+idx}>{x.d}</dd>
                </Fragment>
            )
        });
    };

    useEffect(() => {
        renderDefinition();
    }, [locale]);

    return (
        <Container fluid>
            <Row className="definitionList">
                <Col>
                    <dl>
                        {renderDefinition()}
                    </dl>
                </Col>
            </Row>
        </Container>
    );
};

export default Definition;
