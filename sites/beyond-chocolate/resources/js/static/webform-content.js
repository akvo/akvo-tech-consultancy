import React, { Fragment } from "react";

export const wfc = (handleShow) => {
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
            } 
        },
        
        de: {
            dataSecurityText: <Fragment><a onClick={handleShow} href="#">Datensicherheitsvorkehrungen</a>  für die Daten, die Sie im Rahmen dieser Erhebung eingeben.</Fragment>,
            newProjectPopupText: {
                section: 'A cocoa sustainability project is defined as a programme, project, or initiative targeting (aspects of) sustainability in cocoa production, processing, and/or supply chains. Please note that:',
                list: [
                    "You can register multiple cocoa sustainability projects (programmes/ projects/ initiatives) and report on these separately. This is done by opening a new project questionnaire for each project.",
                    "You can choose to report on all your projects as one (umbrella) programme, thus reporting aggregated data.",
                    'For each project you can specify the geographical intervention areas, this in "repeat groups" per country.'
                ]
            }
        },
    }
};