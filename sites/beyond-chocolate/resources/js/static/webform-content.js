import React, { Fragment } from "react";
import { Alert } from 'react-bootstrap';

export const wfc = (handleShow, activeForm=null) => {
    return {
        en: {
            dataSecurityText: <Fragment><a onClick={handleShow} href="#">Data security provisions</a> for the data that will be submitted as part of this survey.</Fragment>,
            registerCheckBoxText: <Fragment>By clicking this box, I agree to my data being processed according to the <a onClick={handleShow} href="#">Data security provisions</a>.</Fragment>,
            iframeNotLoaded: <Fragment>
                The survey failed to load . Please enable third party cookies in you browser settings to load the survey. <br/>
                In case you do not have the credentials to enable third party cookies, please <Alert.Link href={activeForm} target="_blank">click here </Alert.Link> to load the survey in a separate tab.
            </Fragment>
        },

        de: {
            dataSecurityText: <Fragment><a onClick={handleShow} href="#">Datensicherheitsvorkehrungen</a>  für die Daten, die Sie im Rahmen dieser Erhebung eingeben.</Fragment>,
            registerCheckBoxText: <Fragment>Durch das Ankreuzen dieses Feldes stimme ich der Verarbeitung meiner Daten gemäß der <a onClick={handleShow} href="#">Datenschutzvorkehrungen</a> zu.</Fragment>,
            iframeNotLoaded: <Fragment>
                The survey failed to load . Please enable third party cookies in you browser settings to load the survey. <br/>
                In case you do not have the credentials to enable third party cookies, please <Alert.Link href={activeForm} target="_blank">click here </Alert.Link> to load the survey in a separate tab.
            </Fragment>
        },
    }
};
