import React, { Component, Fragment } from "react";

const hc = (handleShow) => {
    return {
        en: {
            h: "Welcome to the GISCO Monitoring Pilot!",
            p1: "Dear Participants, ",
            p2: <Fragment>
                    Thank you for participating in this pilot of our new monitoring system. Your comments on the monitoring system are very valuable for us. 
                    Before you start, please use <a onClick={handleShow} href="#">this link</a>, to check on the data security measures taken.
                    Thank you very much for your contribution to making the cocoa sector more sustainable!
                </Fragment>,
            btn: "Click here to start the survey",
        },

        de: {
            h: "Willkommen beim GISCO Pilot-Monitoring!",
            p1: "Liebe Teilnehmerinnen und Teilnehmer, ",
            p2: <Fragment>
                    vielen Dank für Ihre Teilnahme am Piloten unseres neuen Monitoringsystems. Ihre Kommentare zum Monitoringsystem sind für uns sehr wertvoll.
                    Bevor Sie beginnen, verwenden Sie bitte <a onClick={handleShow} href="#">diesen link</a>, um die ergriffenen Datensicherheitsmaßnahmen zu überprüfen.
                    Vielen Dank für Ihren Beitrag zur Nachhaltigkeit des Kakaosektors!
                </Fragment>,
            btn: "Click here to start the survey",
        },
    }
}

export { hc };