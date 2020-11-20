import React from "react";
import { Jumbotron } from "react-bootstrap";

const WelcomeBanner = function() {
    return (
        <Jumbotron className="hero">
            <h1>Welcome to Beyond Chocolate Dataportal</h1>
            <div className="colourBg1"></div>
            <div className="colourBg2"></div>
        </Jumbotron>
    );
};

export default WelcomeBanner;
