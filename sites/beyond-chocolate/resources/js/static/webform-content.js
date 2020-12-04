import React, { Fragment } from "react";

export const wfc = (handleShow) => {
    return {
        en: {
            dataSecurityText: <Fragment><a onClick={handleShow} href="#">Data security provisions</a> for the data that will be submitted as part of this survey.</Fragment>,
            newProjectPopupText: [
                "You can register several cocoa sustainability projects (programmes/ projects/ initiatives) and report on these seperately.",
                "For each project you can register multiple intervention areas.",
            ],
        },
        
        de: {
            dataSecurityText: <Fragment><a onClick={handleShow} href="#">Datensicherheitsvorkehrungen</a>  für die Daten, die Sie im Rahmen dieser Erhebung eingeben.</Fragment>,
            newProjectPopupText: [
                "Sie können mehrere Kakao-Nachhaltigkeitsprojekte (-programme/-initiativen) registrieren und separat dazu berichten.",
                "Für jedes Projekt/Programm/Initiative können Sie mehrere Projektgebiete registrieren.",
            ]
        },
    }
};