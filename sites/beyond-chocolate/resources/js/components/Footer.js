import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { ModalImpressum } from "../components/Modal";
import { ic } from "../static/impressum-content";
import { useLocale } from "../lib/locale-context";
import { uiText } from "../static/ui-text";

const Footer = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { locale } = useLocale();
    let content = ic[locale.active];
    let text = uiText[locale.active];

    return (
        <>
            <Row>
                <Col>
                    {/* <div className="partnersLg">
                        <div className="partnerImg">
                            <a href="#">
                                <img src="/images/beyond.jpg" alt="" />
                            </a>
                        </div>
                        <div className="partnerImg">
                            <a href="#">
                                <img src="/images/gisco.jpg" alt="" />
                            </a>
                        </div>
                        <div className="partnerImg">
                            <a href="#">
                                <img src="/images/swiss.jpg" alt="" />
                            </a>
                        </div>
                    </div> */}
                    {/* <div className="bottom-right">
                        <a href="#" onClick={() => handleShow()}>{ text.textFooterImpressum }</a>
                    </div> */}
                </Col>
            </Row>

            {/* <ModalImpressum 
                text={text}
                content={content}
                show={show}
                handleClose={handleClose}
            /> */}
        </>
    );
};

export default Footer;
