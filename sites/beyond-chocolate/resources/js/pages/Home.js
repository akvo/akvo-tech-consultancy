import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Modal
} from "react-bootstrap";


const Home = () => {
    return (
        <Container fluid className="homeLanding">
            <Row>
                <div className="introTxt">
                    <h1>Welcome to the GISCO Monitoring Pilot!</h1>
                    <p><span>Dear Participants,</span> <br/>
Thank you for participating in this pilot of our new monitoring system. Your comments on the monitoring system are very valuable for us. 
Before you start, please use <a href="#">this link</a> to check on the data security measures taken.
Thank you very much for your contribution to making the cocoa sector more sustainable!</p>
                </div>
            </Row>
        </Container>
    );
};

export default Home;
