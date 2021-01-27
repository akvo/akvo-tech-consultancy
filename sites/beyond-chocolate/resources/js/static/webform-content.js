import React, { Fragment } from "react";
import { Alert } from 'react-bootstrap';

export const wfc = (handleShow, activeForm=null) => {
    return {
        en: {
            dataSecurityText: <Fragment><a onClick={handleShow} href="#">Data security provisions</a> for the data that will be submitted as part of this survey.</Fragment>,
            newProjectPopupText: {
                section: 'A cocoa sustainability project is defined as a programme, project, or initiative targeting (aspects of) sustainability in cocoa production, processing, and/or supply chains. Please note that:',
                list: [
                    "You can register multiple cocoa sustainability projects (programmes/ projects/ initiatives) and report on these separately. This is done by opening a new project questionnaire for each project.",
                    "You can choose to report on all your projects as one (umbrella) programme, thus reporting aggregated data.",
                    'For each project you can specify the geographical intervention areas, this in "repeat groups" per country.'
                ], 
            },
            registerCheckBoxText: <Fragment>By clicking this box, I agree to my data being processed according to the <a onClick={handleShow} href="#">Data security provisions</a>.</Fragment>,
            iframeNotLoaded: <Fragment>
                The survey failed to load . Please enable third party cookies in you browser settings to load the survey. <br/>
                In case you do not have the credentials to enable third party cookies, please <Alert.Link href={activeForm} target="_blank">click here </Alert.Link> to load the survey in a separate tab.
            </Fragment>
        },
        
        de: {
            dataSecurityText: <Fragment><a onClick={handleShow} href="#">Datensicherheitsvorkehrungen</a>  für die Daten, die Sie im Rahmen dieser Erhebung eingeben.</Fragment>,
            newProjectPopupText: {
                section: 'Ein Kakao-Nachhaltigkeitsprojekt ist definiert als ein Programm, ein Projekt oder eine Initiative, die auf (Aspekte der) Nachhaltigkeit in der Kakaoproduktion, -verarbeitung und / oder in den Lieferketten abzielt. Bitte beachte, dass:',
                list: [
                    "Sie können mehrere Kakao-Nachhaltigkeitsprojekte (Programme / Projekte / Initiativen) registrieren und separat darüber berichten. Dazu öffnen Sie für jedes Projekt einen neuen Projektfragebogen.",
                    "Sie können alle Ihre Projekte zu ein (Dach-) Programm zusammenfassen und so aggregierte Daten rapportieren. Öffnen Sie in diesem Fall nur einen Projekt-Fragebogen und nutzen diesen für die aggregierten Daten.",
                    'Für jedes Projekt können Sie die Projektgebiete innerhalb eines Landes spezifizieren, in dem Sie die "repeat group"(Gruppe wiederholen)-Funktion (oben rechts) pro Land nutzen.'
                ]
            },
            registerCheckBoxText: <Fragment>Durch das Ankreuzen dieses Feldes stimme ich der Verarbeitung meiner Daten gemäß der <a onClick={handleShow} href="#">Datenschutzvorkehrungen</a> zu.</Fragment>,
            iframeNotLoaded: <Fragment>
                The survey failed to load . Please enable third party cookies in you browser settings to load the survey. <br/>
                In case you do not have the credentials to enable third party cookies, please <Alert.Link href={activeForm} target="_blank">click here </Alert.Link> to load the survey in a separate tab.
            </Fragment>
        },
    }
};