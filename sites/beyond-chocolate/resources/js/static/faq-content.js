import React, { Component, Fragment  } from "react";
import { Accordion, Card } from "react-bootstrap";

const faqEn = [
    {
        h: "How do i report an issue/ request support?",
        c: "The admins of the portal can be contacted using the Feedback form. Once you submit an issue/ request, the admins will contact you at the earliest possible opportunity",
    }, {
        h: "Who can view the data that i enter here?",
        c:
        <Fragment>
            The data that is entered via the questionnaires can be viewed<br/>
            <ol className="ml-2" type="a">
                <li>Your colleagues from your organisation who are added to the portal</li>
                <li>The admins listed in the Data security provisions</li>
                <li>Akvo as the contracted data processors for the system </li>
            </ol>
            Other organisations do not have any access to the data that you enter.
        </Fragment>
    }, {
        h: "Can I delegate the reporting of our projects/ programs to project/program managers outside of my organization?",
        c: <ol className="ml-2" type="a">
            <li>Your colleagues from your organisation who are added to the portal can view and edit your data. There is also the provision to <b>download</b> the data from a questionnaire before submission from the <b>Overview</b> section.<br/><br/>
                <img width={"80%"} className="img img-shadows" src={require('../../images/faq-download-form.png')}/><br/><br/>
            </li>
            <li>Projects questionnaire can be assigned to other member organisations by the coordinator member for contribution on projects that have been jointly implemented.</li>
        </ol>
    }, {
        h: "For which timeframe shall I report the data?",
        c: <ol className="ml-2" type="a">
            <li>Generally, the timeframe for all data is the calendar year 2019 (reporting year). If for some questions, only older data are available, please indicate this in the comment box. For data that might be collected only every few years, the corresponding questions specifically cater for this by asking when the survey/ study was conducted.The reporting year is normally the previous calendar year – e.g. reporting on 2020 to be done in April-May 2021; reporting on 2021 to be done in April-May 2022.</li>
            <li>If the Company / Member organisation is using a reporting cycle and an accounting year that differs from the calendar year and if reporting per calendar year would significantly enhance the reporting burden, then that Company / Member can choose to systematically report for its last accounting year.</li>
            <li>For the GISCO Pilot reporting, the reporting year is in principle the calendar year 2019. If the Company / Member organisation is using an accounting year that differs from the calendar year then that Company / Member can choose to systematically report for its last accounting year for which data are available in the April-May period.</li>
        </ol>
    }, {
        h: "Can i submit a questionnaire without completing all the mandatory questions?",
        c: "It is advised that all mandatory questions are answered before submitting the questionnaire. However in the event that you are not able to fill in all the mandatory questions for various reasons you can still submit the data by clicking on  the submit button and confirming the acknowledgement checkboxes."
    }, {
        h: <Fragment>Why can I not enter numbers with decimals <b>","</b></Fragment>,
        c: <Fragment>The <b>"."</b> is the only decimal separator supported by the system.</Fragment>
    }, {
        h: <Fragment>How does <b>repeat group</b> work?</Fragment>,
        c: <Fragment>
            Some sections of the questionnaires are designed so that you can report on more than one occurrence. Such sections have a <b>Repeat Group</b> button displayed on the top right.<br/><br/>
            <img width={"60%"} className="img img-shadows" src={require('../../images/faq-repeat-group.png')}/><br/><br/>
            To respond to the multiple occurrences , please click the “Repeat Group” button to generate additional group of the same questions. Example  of repeat groups can be found while reporting on countries, project partners,Multi-stakeholder & Policy Initiatives etc.
        </Fragment>
    }, {
        h: "Can several colleagues work on the same questionnaire?",
        c: "All colleagues from your organization can view and work on the questionnaires. However , it is recommended that this is done in a coordinated manner , otherwise the last saved data  will override the previously saved data."
    }, {
        h: "Can I download/extract my data?",
        c: "You can download the data using the download link in the Overview group of the questionnaire."
    }
]

const faq = {
    en: faqEn,
    de: faqEn
}

export { faq };
