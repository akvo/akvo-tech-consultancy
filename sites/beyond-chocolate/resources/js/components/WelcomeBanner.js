import React from "react";
import { Jumbotron } from "react-bootstrap";
import { uiText } from "../static/ui-text";
import { useLocale } from "../lib/locale-context";

const WelcomeBanner = () => {
    const { locale } = useLocale();
    let text = uiText[locale.active];

    return (
        <Jumbotron className="hero">
            <h1>{ text.welcome3 }</h1>
            <div className="colourBg1"></div>
            <div className="colourBg2"></div>
        </Jumbotron>
    );
};

export default WelcomeBanner;
