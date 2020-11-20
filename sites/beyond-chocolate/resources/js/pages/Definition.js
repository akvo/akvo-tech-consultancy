import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Definition = function() {
    return (
        <Container fluid>
            <Row className="definitionList">
                <Col>
                    <dl>
                        <dt>Cacao</dt>
                        <dd>
                           seeds from a small tropical American evergreen tree, from which cocoa, cocoa butter, and chocolate are made. the tree that bears cacao seeds, which are contained in large, oval pods that grow on the trunk. It is now cultivated mainly in West Africa.
                        </dd>
                        <dt>Sustainable</dt>
                        <dd>
                            able to be maintained at a certain rate or level: sustainable fusion reactions.
• conserving an ecological balance by avoiding depletion of natural resources: our fundamental commitment to sustainable development.
2 able to be upheld or defended: sustainable definitions of good educational practice.
                        </dd>
                    </dl>
                </Col>
            </Row>
        </Container>
    );
};

export default Definition;
