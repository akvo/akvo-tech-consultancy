import React, { Component, Fragment } from "react";

export const links = {
    videoDemo: "https://player.vimeo.com/video/451466296",
};

export const qna = [{
    q: "What data is represented in the dashboard and the repository?",
    a: <Fragment>
        <p className="text-justify">The data has been mainly collected through an online stocktaking survey.The online survey was designed to be completed (voluntarily) by <i> 'governments, regional and global instruments, international organizations, the private sector, non-governmental organizations and other relevant contributors' (<strong>UNEEP/EA.4/Res .6OP 7a</strong>) to, capture existing actions and activities happening from January 1<cite>st</cite> 2018 and 'taken to reduce marine plastic litter and micro plastics with the aim of the long term elimination of discharge into the oceans' </i>.</p>
        <p className="text-justify">The survey was designed so that each submission had a focus of one action. Effectively, the action was the data unit(not the organization).Each respondent could submit many actions by completing the survey on repeated occasions.</p>
        <p className="text-justify">As well as a survey, entities could submit to the stocktake using method already developed by the Group of 20 approach, by having a narrative submission response option available using the same template. The narrative submissions have been added to the online repository platform.</p>
        <p className="text-justify">A detailed description of the methodology of the data collection can be found <a href="https://papersmart.unon.org/resolution/uploads/guidelines_for_marine_plastic_litter_stocktake_survey_2_hs1.pdf" target="_blank">here</a>.</p>
    </Fragment>,
    l: false,
}, {
    q: "Why is there an interactive dashboard and an online repository platform?",
    a: <p className="text-justify">To enable access to <a href="https://wedocs.unep.org/bitstream/handle/20.500.11822/28471/English.pdf" target="_blank">the stocktake of global actions to reduce the flow of marine plastic and microplastic to the oceans</a> for public use, two products have been developed. The dashboard aims to visually summarise the survey results, whereas the main goal of the repository is to store additional information on each individual action.</p>,
    l: [
        <p className="text-justify">You are currently visiting the interactive dashboard. The dashboard contains all reported actions via the online survey. The aim of the dashboard is to visually represent the survey data on a number of key attributes. The dashboard also allows for comparison on country/region level and downloading of the visuals.</p>,
        <p className="text-justify">The online repository platform can be accessed here. The repository contains all reported actions via the online survey and narrative submissions. A number of custom filters can be applied to search for individual actions. Thereon, users can visit pages of individual actions to read a summary and access additional information on each action, such as reports in PDF format or corresponding websites.</p>
    ]
}, {
    q: "Who are the dashboard and the repository for?",
    a: <p className="text-justify">The dashboard and repository are both publicly available. Anyone with an interest in the global actions to reduce the flow of marine plastic and microplastic to the oceans. Users can for example be policy makers, researchers, students.</p>,
    l: false,
}, {
    q: "When are the dashboard and the repository built?",
    a: <p className="text-justify">The project of building the dashboard and the repository started at the end of 2019 and both products have been published online in September 2020 in English. Implementation of all 6 UN languages is currently under construction.</p>,
    l: false,
}];

export const glossary = [{
    c: "Multi country actions",
    m: "Actions implementation shared over multiple countries"
},{
    c: "Country actions",
    m: "Actions implemented only in a particular country"
},{
    c: "Keep Filter",
    m: "Ensures that current filter is applicable to all the tabs"
},{
    c: "Region",
    m: "List of Regional seas. Small Island Developing States (SIDS) and Least Developed Countries (LDC)"
}];
