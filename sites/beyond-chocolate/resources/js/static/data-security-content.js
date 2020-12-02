import React, { Component, Fragment } from "react";

const dsc = {
    en: <Fragment>
            <h4>Data ownership and procedures</h4>
            <p className="text-justify">
                The tool developer Akvo does not claim any data ownership. All data that will be collected through the system, will be legally owned by the organisations that enter the data. All rights remain with the organisations to whom the data belong. Akvo systems allow the administration of specified roles and permissions; with corresponding access to data and/or functionalities in the system. 
            </p>
            <p className="text-justify">
                Considering the potential broadening of the system over time, we envisage separate meetings to clarify roles and responsibilities across various stakeholders and clear guidelines and data procedures to administer and implement these roles and corresponding access to data and/or functionalities in the system.
            </p>
            <br/>

            <h4>Data security & privacy</h4>
            <p className="text-justify">
                Akvo maintains strong data security and privacy protection policies, frameworks, and procedures. Data is stored securely; we ensure data is safely encrypted, and your data is never shared with third parties. ​Imported data is owned by you. We comply with the European General Data Protection Regulations (GDPR).
            </p>
            <br/>

            <h4>Secure database</h4>
            <p className="text-justify">
                Akvo software ensures that all data is properly secured when in transit and at rest. For data at rest, Akvo relies on the capabilities of Amazon S3 and Google Datastore, which provide one of the highest security standards in the whole industry. Data is backed-up regularly and stored securely on Google Cloud Storage. For data in transit, all communications between different parts of Akvo’s systems (Browser apps, mobile app, backend services, databases) are encrypted using TLS.
            </p>
            <p className="text-justify">
                Any communication to Akvo’s backend service is properly authenticated and authorized. Akvo software gives administrators the control on what permissions a user has on the platform at a very fine level. All Akvo’s servers are managed by Google which are ISO certified, comply with US and EU regulations and provide round-the-clock security maintenance and essential upgrades for the best level of security. Akvo’s tools are continuously monitored for uptime. 
            </p>
            <p className="text-justify">
                For data <b>at rest</b>, Akvo relies on the capabilities of Google Cloud SQL, which provides one of the highest security standards in the industry. Data is backed-up regularly and stored securely. 
            </p>
            <p className="text-justify">
                For data <b>in transit</b>, all communications between different parts of Akvo’s systems (Browser apps, mobile app, backend services, databases) are encrypted using TLS. Any communication to Akvo’s backend service is properly authenticated and authorised.
            </p>
            <p className="text-justify">
                All Akvo’s servers are <b>hosted in Belgium</b> and managed by Google Cloud Platform which meets ISO 27018, ISO 27017, ISO 27001, comply with US and EU regulations and provide round-the-clock security maintenance and essential upgrades for the best level of security. See <a href="https://cloud.google.com/security/compliance">https://cloud.google.com/security/compliance</a>.
            </p>
            <br/>

            <h4>Roles and permissions</h4>
            <p className="text-justify">
                The platform secretariats of Beyond Chocolate, SWISSCO and GISCO will follow a roles and permissions model, allowing for administrator level and also granular access control to data. Access to questions and attendant response data will be restricted to a user’s specific and defined role and the permissions assigned to that role. A strict permissions model ensures that sensitive data is not accessible nor visible to other users of the platforms.
            </p>
            <p className="text-justify">
                Unless explicitly agreed upon otherwise by the owner of the data, collected data must be entirely anonymized and aggregated before they may be shared with other Members of the platforms and/or rendered public. Any data shared and/or displayed at a disaggregated level internally (e.g. to staff of the secretariats, the platform working groups that accompany the monitoring incl. data evaluation) will be entirely anonymized. 
            </p>
            <p className="text-justify">
                Before publishing (anonymized and aggregated) findings or insights arising from the analysis of collected data, the platform secretariats will still ensure that this does not indirectly disclose sensitive information with respect to a particular Member.
            </p>
            <p className="text-justify">
                Access to data before anonymization is possible only for a very limited number of duly authorized persons having signed non-disclosure commitments; this may solely be done to check for and ensure consistency in data;  getting back to the members to correct for erroneous or contradicting data and/or for providing support to gradual improvement of sustainability reporting by Members. 
            </p>
            <p className="text-justify">
                The following persons will have such access to data before anonymization and aggregation:
            </p>
            <p className="text-justify">
                <u>For GISCO:</u>
            </p>
            <ul className="pl-5">
                <li>Beate Weiskopf, GISCO</li>
                <li>Julia Jawtusch, GISCO</li>
                <li>Patrick Stoop, C-Lever.org</li>
            </ul>

            <p className="text-justify">
                <u>For Beyond chocolate:</u>
            </p>
            <ul className="pl-5">
                <li>Charles Snoeck</li>
                <li>Marloes Humbeeck</li>
                <li>Patrick Stoop, C-Lever.org</li>
            </ul>

            <p className="text-justify">
                <u>For SWISSCO:</u>
            </p>
            <ul className="pl-5">
                <li>Christine Müller</li>
                <li>Simone Benguerel</li>
            </ul>

            <p className="text-justify">
                Each of the named persons above is required to sign a confidentiality agreement before getting data access. Any new personnel at the secretariats or at C-Lever.org that needs to be granted access will have to have signed the confidentiality agreement before getting such access.
            </p>
        </Fragment>
    ,

    de: <Fragment>
            <h4>Dateneigentum und -verfahren</h4>
            <p className="text-justify">
                Der Tool-Entwickler Akvo beansprucht kein Dateneigentum. Alle Daten, die über das System erfasst werden, sind rechtlich Eigentum der Organisationen, die die Daten eingeben. Alle Rechte verbleiben bei den Organisationen, denen die Daten gehören. Akvo-Systeme ermöglichen die Verwaltung bestimmter Rollen und Berechtigungenmit entsprechendem Zugriff auf Daten und / oder Funktionen im System.    
            </p>
            <p className="text-justify">
                Angesichts der möglichen Erweiterung des Systems im Laufe der Zeit planen wir separate Besprechungen, um die Rollen und Verantwortlichkeiten verschiedener Interessengruppen zu klären und Richtlinien und Datenverfahren für die Verwaltung und Implementierung dieser Rollen ,sowie den entsprechenden Zugriff auf Daten und / oder Funktionen im System festzulegen. 
            </p>
            <br/>

            <h4>Datensicherheit und Datenschutz</h4>
            <p className="text-justify">
                Akvo hält strenge Richtlinien und Verfahren für Datensicherheit und Datenschutz ein. Daten werden sicher gespeichert. Wir stellen sicher, dass die Daten sicher verschlüsselt sind und Ihre Daten niemals an Dritte weitergegeben werden. Importierte Daten gehören Ihnen. Wir halten uns an die Europäischen Allgemeinen Datenschutzbestimmungen (DSGVO).
            </p>
            <br/>

            <h4>Sichere Datenbank</h4>
            <p className="text-justify">
                Die Akvo-Software stellt sicher, dass alle Daten während des Transports und in Ruhe ordnungsgemäß gesichert sind. Für ruhende Daten stützt sich Akvo auf die Funktionen von Amazon S3 und Google Datastore, die einen der höchsten Sicherheitsstandards in der gesamten Branche bieten. Die Daten werden regelmäßig gesichert und sicher im Google Cloud Storage gespeichert. Für die Datenübertragung werden alle Kommunikationen zwischen verschiedenen Teilen der Akvo-Systeme (Browser-Apps, mobile Apps, Backend-Dienste, Datenbanken) mit TLS verschlüsselt.
            </p>
            <p className="text-justify">
                Jede Kommunikation mit dem Backend-Service von Akvo wird ordnungsgemäß authentifiziert und autorisiert. Mit der Akvo-Software können Administratoren auf einer sehr detaillierten Ebene steuern, über welche Berechtigungen ein/e Benutzer/in auf der Plattform verfügt. Alle Akvo-Server werden von Google verwaltet, die ISO-zertifiziert sind, den US- und EU-Vorschriften entsprechen und rund um die Uhr Sicherheitswartung und wichtige Upgrades für ein Höchstmaß an Sicherheit bieten. Die Tools von Akvo werden kontinuierlich auf Verfügbarkeit überwacht.
            </p>
            <p className="text-justify">
                Für ruhende Daten stützt sich Akvo auf die Funktionen von Google Cloud SQL, das einen der höchsten Sicherheitsstandards in der Branche bietet. Die Daten werden regelmäßig gesichert und sicher gespeichert.
            </p>
            <p className="text-justify">
                Für die Datenübertragung werden alle Kommunikationen zwischen verschiedenen Teilen der Akvo-Systeme (Browser-Apps, mobile Apps, Backend-Dienste, Datenbanken) mit TLS verschlüsselt. Jede Kommunikation mit dem Backend-Service von Akvo ist ordnungsgemäß authentifiziert und autorisiert.
            </p>
            <p className="text-justify">
                Alle Akvo-Server werden in Belgien gehostet und von der Google Cloud Platform verwaltet, die ISO 27018, ISO 27017, ISO 27001 entspricht, den US- und EU-Vorschriften entspricht und diese einhält und rund um die Uhr Sicherheitswartung und wesentliche Upgrades für ein Höchstmaß an Sicherheit bietet. Siehe <a href="https://cloud.google.com/security/compliance">https://cloud.google.com/security/compliance</a>.
            </p>
            <br/>

            <h4>Rollen und Berechtigungen</h4>
            <p className="text-justify">
                Die Plattformsekretariate von Beyond Chocolate, SWISSCO und dem Forum Nachhaltiger Kakao folgen einem Rollen- und Berechtigungsmodell, das eine Administratorebene-, sowohl  eine detaillierte Zugriffskontrolle auf Daten ermöglicht. Der Zugriff auf Fragen und zugehörige Antwortsdaten ist auf die spezifische und definierte Rolle eines/r Benutzers/in und die dieser Rolle zugewiesenen Berechtigungen beschränkt. Ein striktes Berechtigungsmodell stellt sicher, dass vertrauliche Daten für andere Benutzer der Plattformen weder zugänglich noch sichtbar sind.
            </p>
            <p className="text-justify">
                Sofern mit dem/r Eigentümer/in der Daten nicht ausdrücklich anders vereinbart, müssen die gesammelten Daten vollständig anonymisiert und aggregiert werden, bevor sie mit anderen Mitgliedern der Plattformen geteilt und / oder veröffentlicht werden können. Alle Daten, die intern auf disaggregierter Ebene geteilt und / oder angezeigt werden (z. B. mit den Mitarbeitern/innen der Sekretariate oder den Plattformarbeitsgruppen, die die Überwachung begleiten, einschließlich der Datenauswertung), werden vollständig anonymisiert.
            </p>
            <p className="text-justify">
                Vor der Veröffentlichung der (anonymisierten und aggregierten) Erkenntnisse oder Informationen aus der Analyse der gesammelten Daten stellen die Plattformsekretariate weiterhin sicher, dass dies nicht indirekt sensible Informationen in Bezug auf ein bestimmtes Mitglied offenlegt.
            </p>
            <p className="text-justify">
                Der Zugriff auf Daten vor der Anonymisierung ist nur einer sehr begrenzten Anzahl ordnungsgemäß autorisierter Personen ermöglicht, die Geheimhaltungsverpflichtungen unterzeichnet haben. Der Zugriff kann ausschließlich erfolgen, um die Datenkonsistenz zu überprüfen und sicherzustellen, um mit Rücksprache mit den Mitgliedern fehlerhafte oder widersprüchliche Daten zu korrigieren und / oder um die schrittweise Verbesserung der Nachhaltigkeitsberichterstattung durch die Mitglieder zu unterstützen.
            </p>
            <p className="text-justify">
                Die folgenden Personen haben vor der Anonymisierung und Aggregation einen solchen Datenzugriff:
            </p>
            <p className="text-justify">
                <u>Für das Kakaoforum:</u>
            </p>
            <ul className="pl-5">
                <li>Beate Weiskopf, GISCO</li>
                <li>Julia Jawtusch, GISCO</li>
                <li>Patrick Stoop, C-Lever.org</li>
            </ul>

            <p className="text-justify">
                <u>Für Beyond Chocolate:</u>
            </p>
            <ul className="pl-5">
                <li>Charles Snoeck</li>
                <li>Marloes Humbeeck</li>
                <li>Patrick Stoop, C-Lever.org</li>
            </ul>

            <p className="text-justify">
                <u>Für SWISSCO:</u>
            </p>
            <ul className="pl-5">
                <li>Christine Müller</li>
                <li>Simone Benguerel</li>
            </ul>
            
            <p className="text-justify">
                Jede der oben genannten Personen muss eine Vertraulichkeitsvereinbarung unterzeichnen, bevor sie auf Daten zugreifen kann. Jede/r neue Mitarbeiter/in in den Sekretariaten oder auf C-Lever.org, dem/der Zugang gewährt wird, muss die Vertraulichkeitsvereinbarung unterzeichnet haben, bevor er/sie Zugang erhält.
            </p>
        </Fragment>
    ,
};

export { dsc };