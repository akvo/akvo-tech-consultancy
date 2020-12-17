import React, { Component, Fragment } from "react";

const hc = (handleShow) => {
    return {
        en: {
            h: "Welcome to the GISCO Monitoring Pilot!",
            p1: "Dear Participants, ",
            p2: <Fragment>
                    thank you for participating in this pilot of our new monitoring system. Your comments on the monitoring system are very valuable for us – you can give them in the feedback section (menu above) or in the comment fields in the questionnaires.
                    Before you start, please use <a onClick={handleShow} href="#">this link</a> to check on the data security and confidentiality measures taken.
                    Thank you very much for your contribution to making the cocoa sector more sustainable!
                </Fragment>,
        },

        de: {
            h: "Willkommen beim GISCO Pilot-Monitoring!",
            p1: "Liebe Teilnehmerinnen und Teilnehmer, ",
            p2: <Fragment>
                    vielen Dank für Ihre Teilnahme an der Pilot-Anwendung unseres neuen Monitoringsystems. Ihre Kommentare zum Monitoringsystem sind für uns sehr wertvoll – Sie können diese im Feedbackformular (im Menu oben) oder in den Kommentarfeldern der Fragebögen machen.
                    Bevor Sie beginnen, verwenden Sie bitte <a onClick={handleShow} href="#">diesen link</a>, um die ergriffenen Datensicherheits- und Datenvertraulichkeitsmaßnahmen zu überprüfen.
                    Vielen Dank für Ihren Beitrag zur Verbesserung der Nachhaltigkeit des Kakaosektors!
                </Fragment>,
        },
    }
}

export { hc };