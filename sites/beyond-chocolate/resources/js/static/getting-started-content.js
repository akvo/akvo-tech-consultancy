import React, { Component, Fragment  } from "react";

const gscEn = {
    single: {
        title: "Tool Functionalities",
        body: [
            {
                tab: "Document",
                body: "document"
            },
            {
                tab: "Video",
                body: "video"
            }
        ],
    },
    many: [
        {
            title: "What people frequently asked about?",
            body: <Fragment>Visit <a href="/faq">FAQ page</a></Fragment>
        },
        {
            title: "Questions and Supports",
            body: <Fragment>Please contact ,,,</Fragment>
        }
    ]
};

const gscDe = {
    single: {
        title: "Tool Functionalities De",
        body: [
            {
                tab: "Document",
                body: "document"
            },
            {
                tab: "Video",
                body: "video"
            }
        ],
    },
    many: [
        {
            title: "What people frequently asked about?",
            body: <Fragment>Visit <a href="/faq">faq page</a></Fragment>
        },
        {
            title: "Questions and Supports",
            body: <Fragment>Please contact ,,,</Fragment>
        }
    ]
};

const gsc = {
    en: gscEn,
    de: gscDe
};

export { gsc };