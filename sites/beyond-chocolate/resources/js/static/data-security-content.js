import React, { Fragment } from "react";

const dsc = {
    en: <Fragment>
            <h4>Data ownership and procedures</h4>
            <p className="text-justify">Akvo does not claim data ownership. All data that will be collected, will be legally owned by Beyond Chocolate Partners. Our systems allow the set-up of specified roles and permissions, and with the potential broadening of the engagement over time, we suggest planning a separate meeting to clarify roles and responsibilities (data procedures) across various stakeholders</p>
            <br/>
            <h4>Data security & privacy</h4>
            <p className="text-justify">Akvo maintains strong data security and privacy protection policies, frameworks, and procedures. Data is stored securely; we ensure data is safely encrypted, and your data is never shared with third parties. ​Imported data is owned by you. We comply with the European General Data Protection Regulations (GDPR).</p>
            <br/>
            <h4>Secure database</h4>
            <p className="text-justify">
                Akvo software ensures that all data is properly secured when in transit and at rest. For data at rest, Akvo relies on the capabilities of Amazon S3 and Google Datastore, which provide one of the highest security standards in the whole industry. Data is backed-up regularly, and stored securely on Google Cloud Storage. For data in transit, all communications between different parts of Akvo’s systems (Browser apps, mobile app, backend services, databases) are encrypted using TLS.
                <br />
                Any communication to Akvo’s backend service is properly authenticated and authorized. Akvo software gives administrators the control on what permissions a user has on the platform at a very fine level. All Akvo’s servers are managed by Google which are ISO certified, comply with US and EU regulations and provide round-the-clock security maintenance and essential upgrades for the best level of security. Akvo’s tools are continuously monitored for uptime.
                <br/><br/>
                For data at rest, Akvo relies on the capabilities of Google Cloud SQL, which provides one of the highest security standards in the industry. Data is backed-up regularly, and stored securely.
                <br/><br/>
                For data in transit, all communications between different parts of Akvo’s systems (Browser apps, mobile app, backend services, databases) are encrypted using TLS. Any communication to Akvo’s backend service is properly authenticated and authorised.
                <br/><br/>
                All Akvo’s servers are hosted in Belgium and managed by Google Cloud Platform which meets ISO 27018, ISO 27017, ISO 27001, comply with US and EU regulations and provide round-the-clock security maintenance and essential upgrades for the best level of security. See <a href="https://cloud.google.com/security/compliance">https://cloud.google.com/security/compliance</a>.
            </p>
            <br/>
            <h4>Roles and permissions</h4>
            <p className="text-justify">
                The Beyond Chocolate platform will follow a roles and permissions model, allowing for administrator level and also granular access control to data. Access to questions and attendant response data will be restricted to a user’s specific and defined role and the permissions assigned to that role. A strict permissions model ensures that sensitive data is not accessible or visible to other users of the platform. Any data shared and/or displayed at an aggregate level (e.g. the overall GISCO secretariat ) on the platform will be entirely anonymised.
            </p>
        </Fragment>
    ,

    de: <Fragment>
        <h4>Data ownership and procedures</h4>
        <p className="text-justify">Akvo does not claim data ownership. All data that will be collected, will be legally owned by Beyond Chocolate Partners. Our systems allow the set-up of specified roles and permissions, and with the potential broadening of the engagement over time, we suggest planning a separate meeting to clarify roles and responsibilities (data procedures) across various stakeholders</p>
        <br/>
        <h4>Data security & privacy</h4>
        <p className="text-justify">Akvo maintains strong data security and privacy protection policies, frameworks, and procedures. Data is stored securely; we ensure data is safely encrypted, and your data is never shared with third parties. ​Imported data is owned by you. We comply with the European General Data Protection Regulations (GDPR).</p>
        <br/>
        <h4>Secure database</h4>
        <p className="text-justify">
            Akvo software ensures that all data is properly secured when in transit and at rest. For data at rest, Akvo relies on the capabilities of Amazon S3 and Google Datastore, which provide one of the highest security standards in the whole industry. Data is backed-up regularly, and stored securely on Google Cloud Storage. For data in transit, all communications between different parts of Akvo’s systems (Browser apps, mobile app, backend services, databases) are encrypted using TLS.
            <br />
            Any communication to Akvo’s backend service is properly authenticated and authorized. Akvo software gives administrators the control on what permissions a user has on the platform at a very fine level. All Akvo’s servers are managed by Google which are ISO certified, comply with US and EU regulations and provide round-the-clock security maintenance and essential upgrades for the best level of security. Akvo’s tools are continuously monitored for uptime.
            <br/><br/>
            For data at rest, Akvo relies on the capabilities of Google Cloud SQL, which provides one of the highest security standards in the industry. Data is backed-up regularly, and stored securely.
            <br/><br/>
            For data in transit, all communications between different parts of Akvo’s systems (Browser apps, mobile app, backend services, databases) are encrypted using TLS. Any communication to Akvo’s backend service is properly authenticated and authorised.
            <br/><br/>
            All Akvo’s servers are hosted in Belgium and managed by Google Cloud Platform which meets ISO 27018, ISO 27017, ISO 27001, comply with US and EU regulations and provide round-the-clock security maintenance and essential upgrades for the best level of security. See <a href="https://cloud.google.com/security/compliance">https://cloud.google.com/security/compliance</a>.
        </p>
        <br/>
        <h4>Roles and permissions</h4>
        <p className="text-justify">
            The Beyond Chocolate platform will follow a roles and permissions model, allowing for administrator level and also granular access control to data. Access to questions and attendant response data will be restricted to a user’s specific and defined role and the permissions assigned to that role. A strict permissions model ensures that sensitive data is not accessible or visible to other users of the platform. Any data shared and/or displayed at an aggregate level (e.g. the overall GISCO secretariat ) on the platform will be entirely anonymised.
        </p>
    </Fragment>,
};

export { dsc };