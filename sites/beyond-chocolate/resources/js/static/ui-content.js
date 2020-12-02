import React, { Fragment } from "react";

export const surveyContent = (handleShow) => {
    return {
        en: <Fragment><a onClick={handleShow} href="#">Data security provisions</a> for the data that will be submitted as part of this survey.</Fragment>,
        de: <Fragment><a onClick={handleShow} href="#">Datensicherheitsvorkehrungen</a>  für die Daten, die Sie im Rahmen dieser Erhebung eingeben.</Fragment>,
    }
};