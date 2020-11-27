import React from "react";
import { Jumbotron } from "react-bootstrap";

const WelcomeBanner = () => {
    return (
        <Jumbotron className="hero">
            <h1>Welcome to the GISCO Monitoring Pilot for 2019 data</h1>
            <div className="colourBg1"></div>
            <div className="colourBg2"></div>
        </Jumbotron>
    );
};

export default WelcomeBanner;
