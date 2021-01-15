import React, { Component, Fragment } from "react";

const hc = (handleShow, youtubeLink, slideLink) => {
    return {
        en: {
            h: "Welcome to the GISCO Monitoring Pilot!",
            p1: "Dear Participants, ",
            p2: <Fragment>
                    Thank you for participating in this pilot of our new monitoring system. Your comments on the monitoring system are very valuable for us – you can give them in the feedback section (menu above) or in the comment fields in the questionnaires. <br/>
                    Before you start, please use this <a onClick={handleShow} href="#">link</a> to check on the data security and confidentiality measures taken. <br/><br/>
                    Thank you very much for your contribution to making the cocoa sector more sustainable!
                </Fragment>,
            gettingStarted: {
                h: "Getting Started",
                p1: [
                        <Fragment>For in-depth info, please watch the video at this <a target="_blank" href={youtubeLink}>link</a> (or watch it directly below).</Fragment>,
                        <Fragment>You should also visit our <a href="/faq">FAQ section</a> which contain answers to most questions.</Fragment>
                    ],
                p2: [
                    <Fragment>We also prepare a <a target="_blank" href={slideLink}>slide</a>, describing the tool functionalities.</Fragment>,
                    <Fragment>If you need any more info, don't hesitate to get in touch directly: <a href="/feedback">feedback form</a></Fragment>
                ]
            }
        },

        de: {
            h: "Willkommen beim GISCO Pilot-Monitoring!",
            p1: "Liebe Teilnehmerinnen und Teilnehmer, ",
            p2: <Fragment>
                    vielen Dank für Ihre Teilnahme an der Pilot-Anwendung unseres neuen Monitoringsystems. Ihre Kommentare zum Monitoringsystem sind für uns sehr wertvoll – Sie können diese im Feedbackformular (im Menu oben) oder in den Kommentarfeldern der Fragebögen machen. <br/>
                    Bevor Sie beginnen, verwenden Sie bitte diesen <a onClick={handleShow} href="#">link</a>, um die ergriffenen Datensicherheits- und Datenvertraulichkeitsmaßnahmen zu überprüfen. <br/><br/>
                    Vielen Dank für Ihren Beitrag zur Verbesserung der Nachhaltigkeit des Kakaosektors!
                </Fragment>,
            gettingStarted: {
                h: "Getting Started",
                p1: [
                        <Fragment>For in-depth info, please watch the video at this <a target="_blank" href={youtubeLink}>link</a> (or watch it directly below).</Fragment>,
                        <Fragment>You should also visit our <a href="/faq">FAQ section</a> which contain answers to most questions.</Fragment>
                    ],
                p2: [
                    <Fragment>We also prepare a <a target="_blank" href={slideLink}>slide</a>, describing the tool functionalities.</Fragment>,
                    <Fragment>If you need any more info, don't hesitate to get in touch directly: <a href="/feedback">feedback form</a></Fragment>
                ]
            }
        },
    }
}

export { hc };