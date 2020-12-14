import React, { Component, Fragment  } from "react";
import { Accordion, Card } from "react-bootstrap";

const ic = {
    en: {
        t: "Responsible for the content",
        c: <Fragment>
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0" style={{cursor:"pointer"}}>
                            German Initiative on Sustainable Cocoa (GISCO)
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Card.Text>
                                    Secretariat Berlin <br/>
                                    c/o Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ) GmbH <br/>
                                    Reichpietschufer 20 <br/>
                                    10785 Berlin <br/>
                                    Germany <br/>
                                </Card.Text>
                                <Card.Text>
                                    Secretariat Eschborn <br/>
                                    Postfach 5180 <br/>
                                    65726 Eschborn <br/>
                                    Germany <br/>
                                </Card.Text>
                                <Card.Text>
                                    Contact: Beate Weiskopf <br/>
                                    Email: <a href="mailto:Beate.Weiskopf@giz.de">Beate.Weiskopf@giz.de</a> <br/>
                                </Card.Text>
                                <Card.Text>
                                    Beyond Chocolate <br/>
                                    Fosbury & Sons, Albert <br/>
                                    Koning Albert II Laan 7 <br/>
                                    1210 Brussels <br/>
                                </Card.Text>
                                <Card.Text>
                                    Contact: Charles Snoeck <br/>
                                    Email: <a href="mailto:snoeck@idhtrade.org">snoeck@idhtrade.org</a> <br/>
                                </Card.Text>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1" style={{cursor:"pointer"}}>
                            Akvo Foundation
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <Card.Text>
                                    's-Gravenhekje 1-A,  <br/>
                                    1011 TG Amsterdam, <br/>
                                    The Netherlands <br/>
                                </Card.Text>
                                <p>
                                    Phone: <br/>
                                    +31 20 820 0175 <br/>
                                </p>
                                <p>
                                    E-mail: <br/>
                                    <a href="mailto:">info@akvo.org</a> <br/>
                                </p>
                                <p>
                                    Netherlands Chamber of Commerce (KvK) number: 27327087 <br/>
                                    VAT number: NL 819794727 B01 <br/>
                                </p>
                                <Card.Text>
                                    Akvo Foundation does not commit to nor is it obliged to participate in the alternative dispute resolution for consumer disputes in front of a consumer dispute resolution entity. <br/>
                                    European Commission official website for Online Dispute Resolution: <a href="http://www.ec.europa.eu/consumers/odr">http://www.ec.europa.eu/consumers/odr</a><br/>
                                </Card.Text>
                                <Card.Text>
                                    Data privacy: <br/>
                                    Akvo's data privacy <a href="https://akvo.org/wp-content/uploads/2018/05/Akvo-General-Privacy-policy-FINAL_May18_V1.pdf">https://akvo.org/wp-content/uploads/2018/05/Akvo-General-Privacy-policy-FINAL_May18_V1.pdf</a>
                                </Card.Text>
                                <p>
                                    How can you request removal of your personal data from our systems? <br/>
                                    Please fill out this form (<a href="https://akvo.org/remove-my-personal-data/">https://akvo.org/remove-my-personal-data/</a>) if you'd like to have your personal data removed from our systems or write to our data security officer: <br/>
                                </p>
                                <p>
                                    Valeria Rogatchevskikh <br/>
                                    Email: <a href="mailto:">privacy@akvo.org</a> <br/> 
                                </p>
                                <p>
                                    You can also contact the data security officer to file a complaint. <br/>
                                </p>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Fragment>,
    },

    de: {
        t: "Verantwortlich für den Inhalt",
        c: <Fragment>
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0" style={{cursor:"pointer"}}>
                            Forum Nachhaltiger Kakao e.V
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Card.Text>
                                    Geschäftsstelle Berlin <br/>
                                    c/o Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ) GmbH <br/>
                                    Reichpietschufer 20 <br/>
                                    10785 Berlin <br/>
                                </Card.Text>
                                <Card.Text>
                                    Geschäftsstelle Eschborn <br/>
                                    Postfach 5180 <br/>
                                    65726 Eschborn <br/>
                                </Card.Text>
                                <Card.Text>
                                    Kontakt: Beate Weiskopf <br/>
                                    Email: <a href="mailto:Beate.Weiskopf@giz.de">Beate.Weiskopf@giz.de</a> <br/>
                                </Card.Text>
                                <Card.Text>
                                    Beyond Chocolate <br/>
                                    Fosbury & Sons, Albert <br/>
                                    Koning Albert II Laan 7 <br/>
                                    1210 Brussels <br/>
                                </Card.Text>
                                <Card.Text>
                                    Kontakt: Charles Snoeck <br/>
                                    Email: <a href="mailto:snoeck@idhtrade.org">snoeck@idhtrade.org</a> <br/>
                                </Card.Text>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1" style={{cursor:"pointer"}}>
                            Stiftung Akvo
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <Card.Text>
                                    's-Gravenhekje 1-A,  <br/>
                                    1011 TG Amsterdam, <br/>
                                    Die Niederlande <br/>
                                </Card.Text>
                                <p>
                                    Telefon: <br/>
                                    +31 20 820 0175 <br/>
                                </p>
                                <p>
                                    E-mail: <br/>
                                    <a href="mailto:">info@akvo.org</a> <br/>
                                </p>
                                <p>
                                    Niederländische Handelskammer (KvK) Nummer: 27327087 <br/>
                                    Umsatzsteueridentifikationsnummer: NL 819794727 B01 <br/>
                                </p>
                                <Card.Text>
                                    Die Akvo Foundation ist weder verpflichtet noch daran gebunden, an einer alternativen Streitbeilegung für Verbraucherstreitigkeiten vor einer Verbraucherschlichtungsstelle teilzunehmen. <br/>
                                    Offizielle Website der Europäischen Kommission zur Online-Streitbeilegung: <a href="http://www.ec.europa.eu/consumers/odr">http://www.ec.europa.eu/consumers/odr</a><br/>
                                </Card.Text>
                                <Card.Text>
                                    Datenschutz: <br/>
                                    Akvo's Datenschutz  <a href="https://akvo.org/wp-content/uploads/2018/05/Akvo-General-Privacy-policy-FINAL_May18_V1.pdf">https://akvo.org/wp-content/uploads/2018/05/Akvo-General-Privacy-policy-FINAL_May18_V1.pdf</a>
                                </Card.Text>
                                <p>
                                    Wie können Sie die Löschung Ihrer persönlichen Daten aus unseren Systemen beantragen? <br/>
                                    Bitte füllen Sie dieses Formular (<a href="https://akvo.org/remove-my-personal-data/">https://akvo.org/remove-my-personal-data/</a>) aus, wenn Sie Ihre persönlichen Daten aus unseren Systemen entfernen lassen möchten oder schreiben Sie an unseren Datenschutzbeauftragten: <br/>
                                </p>
                                <p>
                                    Valeria Rogatchevskikh <br/>
                                    Email: <a href="mailto:">privacy@akvo.org</a> <br/>
                                </p>
                                <p>
                                    Sie können sich auch an den Datenschutzbeauftragten wenden, um eine Beschwerde einzureichen. <br/>
                                </p>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Fragment>,
    }
};

export { ic };