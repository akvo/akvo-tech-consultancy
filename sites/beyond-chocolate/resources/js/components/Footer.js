import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = function() {
    return (
            <Row>
                <Col>
                    <div className="partnersLg">
                        <div className="partnerImg">
                            <a href="#">
                                <img src="../../images/beyond.jpg" alt="" />
                            </a>
                        </div>
                        <div className="partnerImg">
                            <a href="#">
                                <img src="../../images/gisco.jpg" alt="" />
                            </a>
                        </div>
                        <div className="partnerImg">
                            <a href="#">
                                <img src="../../images/swiss.jpg" alt="" />
                            </a>
                        </div>
                    </div>           
                </Col>
            </Row>
    );
};

export default Footer;
