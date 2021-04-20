import React, { Component, Fragment  } from "react";
import { Accordion, Card } from "react-bootstrap";

const faqEn = [
    {
        h: "Access to data - Who can view or access the data that I enter via a questionnaire?",
        c:
        <Fragment>
            <p>The data that is entered via the questionnaires can be accessed by:</p>
            <ol className="ml-2" type="a">
                <li>The colleagues from your own organization who are added as users to the portal, depending on the type of access provided to them (member questionnaire, project questionnaires, or both). As long as the questionnaire is not submitted, they can access and edit data of the questionnaire.</li>
                <li>For project questionnaires, colleagues from selected project partner organizations, that are also Members of GISCO, with authorized access to project questionnaires, will have the same access to data of the questionnaire for the project in which their own organization is participating as a partner.</li>
                <li>Once the questionnaire is submitted, a limited number of staff designated by the GISCO Secretariat, listed in the Data Security Provisions and having signed corresponding nondisclosure declarations, will have access to individual questionnaire data, as needed to check the validity and consistency of data and/or check whether the conclusions from analysis on anonymized and/or aggregated data makes sense.</li>
                <li>Authorized staff of AKVO, being the contracted IT service provider/data processors for the system. Their role is limited to intervening when IT issues occur and providing data processing support.</li>
            </ol><br/>
            <p>Other users of the platform or other organisations do not have any access to the data that you enter.</p>
            <p>Please also check on <b>How is the confidentiality of our data preserved?</b></p>
        </Fragment>
    }, {
        h: <Fragment>Decimals - Why can I not enter numbers with decimals <b>(,)</b>?</Fragment>,
        c:
        <Fragment>
            <p>Please use a <b>dot (.)</b>, instead of a <b>comma (,)</b>!</p>
            <p>The <b>dot (.)</b> is the only decimal separator supported by the system.</p>
        </Fragment>
    }, {
        h: "Double counting – How is double counting of cocoa supplied to the German market being avoided?",
        c:
        <Fragment>
            <p>For the question groups, <b>Origin Transparency and Traceability</b> and <b>Certified or Independently Verified Cocoa</b>, GISCO reporting is focusing on cocoa contained in consumer end products supplied to the German market.</p>
            <p>To avoid double counting, the corresponding volume of cocoa (expressed in MT-BE or metric tons – bean equivalents), is to be reported by the consumer brands; with retailers reporting for their own labels in the same way as consumer brands.</p>
            <p>At this stage, GISCO Members are not asked to report on the volume of cocoa sourced for processing and/or producing intermediary or end consumer products in Germany. If such data was to be reported in a later stage, such data on cocoa processing would be accounted for separately; thus, still avoiding double counting.</p>
        </Fragment>
    }, {
        h: "Double counting – How is double counting of project data and other data being avoided?",
        c:
        <Fragment>
            <p>Members can report on all their cocoa sustainability projects/ programs, without requiring a link with the German market. However, each such project/ program shall be reported only once. Projects/ programs implemented jointly by several GISCO members will be registered and reported on only once.</p>
            <p>The transition towards a joint reporting tool for the different European platforms ensures that companies and other organizations, who are a member of multiple (or all) European platforms, will have to report on the same data only once. This single reporting contributes to avoiding double counting.</p>
            <p>Cocoa sustainability projects/ program managers are encouraged to avoid double counting within their own reporting to GISCO and to the other platforms.</p>
            <p>However, at this stage it may for example not be excluded that a same farming household is reported as <b>reached</b> by more than one project. Further analysis will demonstrate whether such double counting is occurring at a significant rate and if so, what approach is to be used to correct for that double counting.</p>
        </Fragment>
    }, {
        h: "Downloading - Can I download/extract my data?",
        c:
        <Fragment>
            <p>You can indeed download the data of a (fully/partially) completed questionnaire. You can do this to allow for off-line review and/or contribution by a colleague, before submitting the questionnaire.</p>
            <img height="400px" className="img img-shadows" src={require('../../images/faq-download-form.png')}/><br/><br/>
            <p>To activate such download, please first click the <b>Overviews</b> button at the left side of your screen (above the question group navigation menu in the left column of the screen).</p>
            <p>Before submitting your completed questionnaire, you are also advised to download a version for your own records.</p>
        </Fragment>
    }, {
        h: "German market – To what extent is data to be reported specifically linked to the German market?",
        c:
        <Fragment>
            <p>Reporting is first linked to the reporting organization’s membership of GISCO and to the Member’s efforts and results in pursuing a more sustainable cocoa sector.</p>
            <p>Only 2 question groups, <b>Origin Transparency and Traceability</b> and <b>Certified or Independently Verified Cocoa</b>, refer to cocoa contained in the end consumer products that the reporting organisations supplied to the German market.</p>
            <ul>
                <li>It should be noted that the volume of cocoa contained in consumer end products supplied to the national market in Europe (in this case being the German market) is to be reported by the consumer brands. This volume is expressed in MT-BE (metric tons – bean equivalents). For their own labels (brands), retailers are expected to report in the same way as the consumer brands. Of course, where required, these brands will rely on the corresponding information obtained from their suppliers.</li>
                <li>To the extent that such information can be disaggregated by market of destination (in this case Germany), the % to be reported under these two question groups shall be specific to the German market. Otherwise, the reporting organisations shall provide the % that correspond to their global sourcing</li>
                <li>Such % corresponding to their global sourcing can also be provided, even if the reporting organisation is not providing end consumer products to the German market.</li>
            </ul>
            <p>The data to be provided under the other question groups are not particulary or specifically linked to the German market.</p>
        </Fragment>
    }, {
        h: "Issues - How do I report an issue/ request support ?",
        c: <p>The portal administrators can be contacted using the feedback form. To go to that form, please select <b>Feedback</b> in the menu in the top left / centre of the screen. Once you submit an issue/ request, the portal administrators will contact you as soon as possible.</p>
    }, {
        h: "Mandatory questions - Can I submit a questionnaire without completing all the mandatory questions ?",
        c:
        <Fragment>
            <p>It is highly appreciated that all mandatory questions are answered (completed) before submitting the questionnaire.</p>
            <p>However, in the event that you are not able to fill in all the mandatory questions for various reasons you can still submit the data by clicking on the submit button and confirming the acknowledgement checkboxes:</p>
            <ul>
                <li>I have checked and tried to complete all mandatory fields that are marked as still to be completed.</li>
                <li>I have used the comments boxes in the corresponding question groups to explain why I cannot complete the still uncompleted mandatory fields.</li>
            </ul>
        </Fragment>,
    }, {
        h: "Multi-selection - Why can I not select more than one item from a list ?",
        c:
        <Fragment>
            <p>For many cases, e.g. for topics, the questionnaire does allow you to select multiple options from a list.</p>
            <p>For other questions, the questionnaire allows you to select only one choice at a time; this allows you to provide additional information on that choice. “Repeat groups” can be used to also select other choices (one at a time) and to provide the corresponding data. Please refer to the FAQ item <b>How does repeat group work ?</b></p>
        </Fragment>,
    }, {
        h: <Fragment>Repeat group – What is a <b>repeat group</b> and how does it work ?</Fragment>,
        c:
        <Fragment>
            <p>Some sections of the questionnaires are designed to allow you to report separately on more than one occurrence. Such sections have a <b>Repeat Group +</b> button displayed on the top right.</p>
            <p>Each <b>Repeat Group</b> allows you to report on only one initiative/ one country/ one lesson learned/ one project partner, etc.</p>
            <p>To report on additional occurrences in your answer to a question, please add another repeat group by clicking the blue <b>Repeat Group +</b> button in the top right of your screen.</p>
            <img height="120px" className="img img-shadows" src={require('../../images/faq-repeat-group.png')}/><br/><br/>
            <p>To learn how this applies to specific questions, please click on the “More Info” button displayed with those questions.</p>
            <p>Examples of Repeat Groups can be found while reporting on countries, project partners, Multi-stakeholder & Policy Initiatives, etc.</p>
        </Fragment>,
    }, {
        h: "Reporting by project managers - Can I delegate the reporting of our projects/ programs to project/ program managers, inside or outside of my organization ?",
        c:
        <ol type="1">
            <li>Colleagues from your own organisation who are added as users to the portal with authorisation to create/edit project questionnaires, can view and edit data of your organisation’s project questionnaires. You should agree among colleagues of the same organisation as to whom will complete / review project data before submission of the completed questionnaire.</li>
            <li>For a cocoa sustainability project/ programme that is jointly implemented by different GISCO member organisations, only one questionnaire should be created; this is to be done by the GISCO member designated as the coordinating or lead partner for that project.</li>
            <li>Access to the corresponding project questionnaire will be granted to all colleagues from the selected project partner organisations who are registered as users of the platform with authorised access to project questionnaires. Please refer to the FAQ topic <b>Adding Collaborators</b> for more explanations on how to grant access to a specific project questionnaire for partner organisations. Please note that you should agree among colleagues of the different project partner organisations as to whom will complete / review project data before submission of the completed questionnaire.</li>
            <li>There is also the possibility to download the data of a (fully / partially) completed questionnaire to allow for off-line review and/or contribution by a colleague, before submitting the questionnaire. To activate such download, please first click the <b>Overview</b> button at the left of your screen (above the question group navigation menu in the left column of the screen).</li>
        </ol>
    }, {
        h: "Simultaneous contributions - Can several colleagues work on the same questionnaire ?",
        c:
        <Fragment>
            <p>Colleagues from your own organisation or from project partner organisations (for the project questionnaire) can view and work on the same questionnaire. (Refer also to FAQ topics <b>Access to data</b> and <b>Reporting by project managers</b>.</p>
            <p>However, it is recommended that this is done in a coordinated manner. Simultaneously working on the same questionnaire is not advised, as the last saved data may inadvertently override the previously saved data.</p>
        </Fragment>
    }, {
        h: "Time frame - For which time frame shall I report the data ?",
        c:
        <ol type="1">
            <li>The reporting year is normally the previous calendar year – e.g. reporting on 2020 to be done in April-May 2021; reporting on 2021 to be done in April-May 2022.</li>
            <li>For the Pilot reporting, the reporting year is in principle the calendar year 2019. </li>
            <li>If the member organisation is using a reporting cycle and an accounting year that differs from the calendar year, and if reporting per calendar year would significantly enhance the reporting burden, then that member can choose to systematically report for its last accounting year for which data is available in the April-May period.</li>
            <li>Generally, the time frame for all data is the reporting year. However, for some questions (e.g. household income data), data might be collected only every few years. The corresponding questions specifically cater for this by asking when the last survey/ study was conducted. </li>
            <li>If for some other questions, only older data are available, please provide such older data and indicate this in the comment box. However, this should not apply to questions on efforts conducted or outputs achieved in the particular reporting year.</li>
        </ol>
    }, {
        h:"Adding collaborators – How can I add project partner organisations as collaborators to a project questionnaire ?",
        c:
        <Fragment>
            <p>The steps described below allow you to grant access to the corresponding project questionnaire to colleagues from selected project partner organisations.</p>
            <p>First, you need to open a project questionnaire, respond to the first question <b>Please provide the identification - the name - of the sustainability project (/program)</b> and save the questionnaire.</p>
            <p>Then, you can use the blue “Add Collaborators” button. However, first make sure that you select the right project questionnaire from the dropdown list in the “pick a previously saved form” menu in the top of your screen.</p>
            <p>When you have done so, an additional menu will appear to allow you to select a <b>Contributing organisation</b> from a drop-down list.</p>
            <p>Please select your partner organisations and click the blue <b>Add</b> button. The added organisation will appear. The authorised platform users of that organisation, having user rights for project questionnaires, will now be automatically informed by email that they are invited to contribute to completing and/or reviewing the draft project questionnaire for your joint cocoa sustainability project/ program.</p>
            <p>Please note that you should agree among colleagues of the different project partner organisations as to whom will complete / review project data before submission of the completed questionnaire.</p>
            <p>Please also note that you can still remove the <b>contributing organisation</b> that you have added previously. This is done by clicking on the <b>x</b> next to the name of that contributing organisation.</p>
        </Fragment>
    }
]

const faqDe = [
    {
        h: "Zugriff auf Daten - Wer kann die von mir über einen Fragebogen eingegebenen Daten einsehen oder darauf zugreifen ?",
        c:
        <Fragment>
            <p>Auf die Daten, die über die Fragebögen eingegeben werden, kann zugegriffen werden durch:</p>
            <ol className="ml-2" type="a">
                <li>Die Kolleg*innen aus Ihrer eigenen Organisation, die je nach Art des Zugriffs (Mitgliederfragebogen, Projektfragebogen oder beides) als Nutzer*innen zum Portal hinzugefügt werden. Solange der Fragebogen noch nicht eingereicht ist, können sie auf Daten des Fragebogens zugreifen und diese bearbeiten.</li>
                <li>Bei Projektfragebögen haben Kolleg*innen ausgewählter Projektpartnerorganisationen, die auch Mitglieder des Kakaoforums sind und über autorisierten Zugriff auf Projektfragebögen verfügen, denselben Zugriff auf die Daten des Fragebogens für das Projekt, an dem Ihre eigene Organisation als Partner teilnimmt.</li>
                <li>Sobald der Fragebogen eingereicht wurde, hat eine begrenzte Anzahl von Mitarbeitenden, die von der Geschäftsstelle des Kakaoforums ausgewählt wurden, und die in den Datenschutzbestimmungen aufgeführt sind und entsprechende Vertraulichkeits-Erklärungen unterzeichnet haben, Zugriff auf einzelne Fragebogendaten, um die Gültigkeit und die Konsistenz der Daten zu überprüfen und / oder um zu überprüfen, ob die Schlussfolgerungen aus der Analyse anonymisierter und / oder aggregierter Daten schlüssig sind.</li>
                <li>Autorisierte Mitarbeitende von AKVO als beauftragter IT-Dienstleister / Datenverarbeiter für das System. Ihre Rolle beschränkt sich darauf, bei IT-Problemen einzugreifen und Unterstützung für die Datenverarbeitung bereitzustellen.</li>
            </ol>
            <p>Andere Nutzer*innen der Plattform oder andere Organisationen haben keinen Zugriff auf die von Ihnen eingegebenen Daten.</p>
            <p>Bitte schauen Sie auch bei <b>Wie wird die Vertraulichkeit unserer Daten gewahrt  ?</b></p>
        </Fragment>
    }, {
        h: <Fragment>Dezimalstellen - Warum kann ich keine Zahlen mit Dezimalstellen <b>,</b> eingeben ?</Fragment>,
        c:
        <Fragment>
            <p>Verwenden Sie bitte einen <b>Punkt (.)</b>, anstelle eines <b>Kommas (,)</b>!</p>
            <p>Das <b>punkt (.)</b> ist das einzige vom System unterstützte Dezimaltrennzeichen.</p>
        </Fragment>
    }, {
        h: "Doppelzählung - Wie wird eine Doppelzählung des an den deutschen Markt gelieferten Kakaos vermieden ?",
        c:
        <Fragment>
            <p>Für die Fragengruppen <b>Transparenz und Rückverfolgbarkeit der Herkunft</b> und <b>Zertifizierter oder unabhängig verifizierter Kakao</b> konzentriert sich die Berichterstattung des Kakaoforums auf Kakao in Endprodukten für Verbraucher, die an den deutschen Markt geliefert werden.</p>
            <p>Um Doppelzählungen zu vermeiden, ist das entsprechende Kakaovolumen (ausgedrückt in MT-BE bzw. Tonnen - Bohnenäquivalente) von den Verbrauchermarken anzugeben; Einzelhändler berichten auf die gleiche Weise wie Verbrauchermarken für ihre eigenen Labels.</p>
            <p>Derzeit werden die Mitglieder des Kakaoforums nicht gebeten, über die Menge an Kakao zu berichten, die zur Verarbeitung und / oder Herstellung von Zwischen- oder Endverbraucherprodukten in Deutschland bezogen wird. Wenn zu solchen Daten zu einem späteren Zeitpunkt berichtet werden sollte, würden diese Daten zur Kakaoverarbeitung separat erfasst werden. So wird immer noch eine Doppelzählung vermieden.</p>
        </Fragment>
    }, {
        h: "Doppelzählung - Wie wird eine Doppelzählung von Projektdaten und anderen Daten vermieden ?",
        c:
        <Fragment>
            <p>Mitglieder können über alle ihre Kakao-Nachhaltigkeitsprojekte / -programme berichten, ohne eine Verbindung zum deutschen Markt zu benötigen. Jedes dieser Projekte / Programme wird jedoch nur einmal gemeldet. Projekte / Programme, die von mehreren Forums-Mitgliedern gemeinsam durchgeführt werden, werden nur einmal registriert und rapportiert.</p>
            <p>Der Übergang zu einem gemeinsamen Berichtstool für die verschiedenen europäischen Plattformen stellt sicher, dass Unternehmen und andere Organisationen, die Mitglied mehrerer (oder aller) europäischer Plattformen sind, nur einmal über dieselben Daten berichten müssen. Diese Einzelberichterstattung trägt dazu bei, Doppelzählungen zu vermeiden.</p>
            <p>Kakao-Nachhaltigkeitsprojekt-/ Programmmanager*innen werden aufgefordert, Doppelzählungen innerhalb ihrer eigenen Berichterstattung an das Kakaoforum und an die anderen Plattformen zu vermeiden.</p>
            <p>Zum jetzigen Zeitpunkt kann jedoch beispielsweise nicht ausgeschlossen werden, dass ein bäuerlicher Haushalt von mehr als einem Projekt als „erreicht“ gemeldet wird. Weitere Analysen werden zeigen, ob eine solche Doppelzählung mit einer signifikanten Rate auftritt und wenn ja, welcher Ansatz zur Korrektur dieser Doppelzählung verwendet werden sollte.</p>
        </Fragment>
    }, {
        h: "Herunterladen - Kann ich meine Daten herunterladen / extrahieren ?",
        c:
        <Fragment>
            <p>Sie können in der Tat die Daten eines (vollständig / teilweise) ausgefüllten Fragebogens herunterladen. Sie können dies tun, um eine Offline-Überprüfung und / oder einen Beitrag eines Kollegen zu ermöglichen, bevor Sie den Fragebogen einreichen.</p>
            <img height="400px" className="img img-shadows" src={require('../../images/faq-download-form.png')}/><br/><br/>
            <p>Um einen solchen Download zu aktivieren, klicken Sie zunächst auf die Schaltfläche <b>Übersichten (<i>Overviews</i>)</b> auf der linken Seite Ihres Bildschirms (über dem Navigationsmenü der Fragengruppe in der linken Spalte des Bildschirms).</p>
            <p>Bevor Sie Ihren ausgefüllten Fragebogen einreichen, sollten Sie auch eine Version für Ihre eigenen Unterlagen herunterladen.</p>
        </Fragment>
    }, {
        h: "Deutscher Markt - Inwieweit sind die zu meldenden Daten spezifisch mit dem deutschen Markt verknüpft ?",
        c:
        <Fragment>
            <p>Die Berichterstattung hängt zunächst mit der Mitgliedschaft der berichtenden Organisation im Kakaoforum sowie mit den Bemühungen und Ergebnissen des Mitglieds bei der Verfolgung eines nachhaltigeren Kakaosektors zusammen.</p>
            <p>Nur zwei Fragengruppen, <b>Transparenz und Rückverfolgbarkeit der Herkunft</b> und <b>Zertifizierter oder unabhängig verifizierter Kakao</b>, beziehen sich auf Kakao in den Endverbraucherprodukten, die die berichtenden Organisationen an den deutschen Markt geliefert haben.</p>
            <ul>
                <li>Es ist zu beachten, dass das Kakaovolumen in Endprodukten für Verbraucher, die an den nationalen Markt in Europa (in diesem Fall den deutschen Markt) geliefert werden, von den Verbrauchermarken zu melden ist. Dieses Volumen wird in MT-BE (Tonnen - Bohnen Äquivalente) ausgedrückt. Von Einzelhändlern wird erwartet, dass sie für ihre eigenen Marken (Marken) auf die gleiche Weise wie die Verbrauchermarken berichten. Natürlich verlassen sich diese Marken bei Bedarf auf die entsprechenden Informationen ihrer Lieferanten.</li>
                <li>Soweit solche Informationen nach Bestimmungsmarkt (in diesem Fall Deutschland) aufgeschlüsselt werden können, ist der unter diesen beiden Fragengruppen zu meldende Prozentsatz spezifisch für den deutschen Markt. Andernfalls geben die berichtenden Organisationen den Prozentsatz an, der ihrer globalen Beschaffung entspricht.</li>
                <li>Solche %, die ihrer globalen Beschaffung entsprechen, können selbst dann bereitgestellt werden, wenn die berichtende Organisation keine Endverbraucherprodukte an den deutschen Markt liefert.</li>
            </ul>
            <p>Die Daten, die unter den anderen Fragengruppen anzugeben sind, sind nicht speziell oder spezifisch mit dem deutschen Markt verbunden.</p>
        </Fragment>
    }, {
        h: "Probleme - Wie melde ich ein Problem / fordere ich Unterstützung an ?",
        c: <p>Die Portaladministratoren können über das Feedback-Formular kontaktiert werden. Um zu diesem Formular zu gelangen, wählen Sie bitte <b>Feedback</b> im Menü oben links / in der Mitte des Bildschirms. Sobald Sie ein Problem / eine Anfrage eingereicht haben, werden sich die Portaladministratoren so schnell wie möglich mit Ihnen in Verbindung setzen.</p>
    }, {
        h: "Obligatorische Fragen - Kann ich einen Fragebogen einreichen, ohne alle obligatorischen Fragen auszufüllen ?",
        c:
        <Fragment>
            <p>Es wird sehr empfohlen und wertgeschätzt, dass alle obligatorischen Fragen vor dem Absenden des Fragebogens beantwortet (bzw. ausgefüllt) werden.</p>
            <p>Falls Sie jedoch aus verschiedenen Gründen nicht alle obligatorischen Fragen ausfüllen können, können Sie die Daten dennoch übermitteln, indem Sie auf die Schaltfläche "Senden" klicken und die Kontrollkästchen zur Bestätigung bestätigen:</p>
            <ul>
                <li>Ich habe alle Pflichtfelder überprüft und versucht, die die die als nicht ausgefüllt markiert sind, auszufüllen.</li>
                <li>Ich habe die Kommentarfelder in den entsprechenden Fragengruppen verwendet, um zu erklären, warum ich die noch nicht ausgefüllten Pflichtfelder nicht ausfüllen kann.</li>
            </ul>
        </Fragment>,
    }, {
        h: "Mehrfachauswahl - Warum kann ich nicht mehr als ein Element aus einer Liste auswählen ?",
        c:
        <Fragment>
            <p>In vielen Fällen, z.B für Themen, können Sie im Fragebogen mehrere Optionen aus einer Liste auswählen.</p>
            <p>Bei anderen Fragen können Sie im Fragebogen jeweils nur eine Auswahl treffen. Auf diese Weise können Sie zusätzliche Informationen zu dieser Auswahl bereitstellen. <b>Wiederholungsgruppen (<i>Repeat Group</i>)</b> können verwendet werden, um auch andere Auswahlmöglichkeiten (einzeln) auszuwählen und die entsprechenden Daten bereitzustellen. Weitere Informationen finden Sie im FAQ-Punkt <b>Wie funktioniert die„ Wiederholungsgruppe ?</b></p>
        </Fragment>,
    }, {
        h: <Fragment>Wiederholungsgruppe - Was ist eine <b>Wiederholungsgruppe (<i>Repeat Group</i>)</b> und wie funktioniert sie ?</Fragment>,
        c:
        <Fragment>
            <p>In einigen Abschnitten der Fragebögen können Sie mehr als ein Ereignis separat melden. In solchen Abschnitten wird oben rechts die Schaltfläche <b>Gruppe wiederholen (<i>Repeat Group + </i>)</b> angezeigt.</p>
            <p>Mit jeder <b>Wiederholungsgruppe</b> können Sie nur über eine Initiative / ein Land / eine Lektion / einen Projektpartner usw. berichten.</p>
            <p>Um weitere Aussagen in Ihrer Antwort auf eine Frage zu treffen, fügen Sie bitte eine weitere Wiederholungsgruppe hinzu, indem Sie oben rechts auf dem Bildschirm auf die blaue Schaltfläche <b>Wiederholungsgruppe (<i>Repeat Group+ </i>) </b>klicken.</p>
            <img height="120px" className="img img-shadows" src={require('../../images/faq-repeat-group.png')}/><br/><br/>
            <p>Um zu erfahren, wie dies für bestimmte Fragen gilt, klicken Sie bitte auf die Schaltfläche <b>Weitere Informationen (<i>More Info</i>)</b>, die mit diesen Fragen angezeigt wird.</p>
            <p>Beispiele für Wiederholungsgruppen finden Sie bei der Berichterstattung über Länder, Projektpartner, Multi-Stakeholder- und Richtlinieninitiativen usw.</p>
        </Fragment>,
    }, {
        h: "Berichterstattung durch Projektmanager*innen - Kann ich die Berichterstattung über unsere Projekte / Programme an Projekt- / Programmmanager*innen innerhalb oder außerhalb meiner Organisation delegieren ?",
        c:
        <ol type="1">
            <li>Kollegen aus Ihrer eigenen Organisation, die als Benutzer mit der Berechtigung zum Erstellen / Bearbeiten von Projektfragebögen zum Portal hinzugefügt werden, können Daten der Projektfragebögen Ihrer Organisation einsehen und bearbeiten. Sie sollten sich unter Kollegen derselben Organisation darauf einigen, wer die Projektdaten ausfüllen / überprüfen wird, bevor Sie den ausgefüllten Fragebogen einreichen.</li>
            <li>Für ein Kakao-Nachhaltigkeitsprojekt / -programm, das von verschiedenen Kakaoforums-Mitgliedsorganisationen gemeinsam durchgeführt wird, sollte nur ein Fragebogen erstellt werden. Dies muss von dem Kakaoforums-Mitglied durchgeführt werden, das als koordinierender oder federführender Partner für dieses Projekt bestimmt ist.</li>
            <li>Der Zugriff auf den entsprechenden Projektfragebogen wird allen Kollegen der ausgewählten Projektpartnerorganisationen gewährt, die als Benutzer der Plattform mit autorisiertem Zugriff auf Projektfragebögen registriert sind. Weitere Erläuterungen zum Gewähren des Zugriffs auf einen bestimmten Projektfragebogen für Partnerorganisationen finden Sie im FAQ-Thema <b>Hinzufügen von Mitarbeitern</b>. Bitte beachten Sie, dass Sie unter den Kollegen der verschiedenen Projektpartnerorganisationen vereinbaren sollten, wer die Projektdaten ausfüllen / überprüfen soll, bevor Sie den ausgefüllten Fragebogen einreichen.</li>
            <li>Es besteht auch die Möglichkeit, die Daten eines (vollständig / teilweise) ausgefüllten Fragebogens herunterzuladen, um eine Offline-Überprüfung und / oder einen Beitrag eines Kollegen zu ermöglichen, bevor der Fragebogen eingereicht wird. Um einen solchen Download zu aktivieren, klicken Sie zunächst links auf dem Bildschirm auf die Schaltfläche „Übersicht“ (über dem Navigationsmenü der Fragengruppe in der linken Spalte des Bildschirms).</li>
        </ol>
    }, {
        h: "Gleichzeitige Beiträge - Können mehrere Kollegen an demselben Fragebogen arbeiten ?",
        c:
        <Fragment>
            <p>Kollegen aus Ihrer eigenen Organisation oder aus Projektpartnerorganisationen (für den Projektfragebogen) können denselben Fragebogen einsehen und bearbeiten. (Siehe auch FAQ-Themen <b>Zugriff auf Daten</b> und <b>Berichterstattung durch Projektmanager</b>.</p>
            <p>Es wird jedoch empfohlen, dies auf koordinierte Weise zu tun. Die gleichzeitige Bearbeitung desselben Fragebogens wird nicht empfohlen, da die zuletzt gespeicherten Daten möglicherweise versehentlich die zuvor gespeicherten Daten überschreiben.</p>
        </Fragment>
    }, {
        h: "Zeitrahmen - Für welchen Zeitraum soll ich die Daten melden ?",
        c:
        <ol type="1">
            <li>Das Berichtsjahr ist normalerweise das vorherige Kalenderjahr - z. Berichterstattung über 2020 von April bis Mai 2021; Berichterstattung über 2021 soll von April bis Mai 2022 erfolgen.</li>
            <li>Für die Pilot-Berichterstattung ist das Berichtsjahr grundsätzlich das Kalenderjahr 2019.</li>
            <li>Wenn die Mitgliedsorganisation einen vom Kalenderjahr abweichenden Berichtszyklus und ein Rechnungsjahr verwendet, das vom Kalenderjahr abweicht und die Berichterstattung pro Kalenderjahr die Berichtslast erheblich erhöhen würde, kann dieses Mitglied systematisch über das letzte Rechnungsjahr berichten, für das Daten im Zeitraum April bis Mai vorliegen.</li>
            <li>Im Allgemeinen ist der Zeitrahmen für alle Daten das Berichtsjahr. Bei einigen Fragen (z. B. Daten zum Haushaltseinkommen) werden Daten möglicherweise nur alle paar Jahre erhoben. Die entsprechenden Fragen berücksichtigen dies speziell, indem sie fragen, wann die letzte Umfrage / Studie durchgeführt wurde.</li>
            <li>Wenn für einige andere Fragen nur ältere Daten verfügbar sind, geben Sie diese bitte an und geben Sie dies im Kommentarfeld an. Dies soll jedoch nicht für Fragen zu den im jeweiligen Berichtsjahr durchgeführten Anstrengungen oder Ergebnissen gelten.</li>
        </ol>
    }, {
        h:"Hinzufügen von Mitarbeitern - Wie kann ich Projektpartnerorganisationen als Mitarbeiter zu einem Projektfragebogen hinzufügen ?",
        c:
        <Fragment>
            <p>Mit den unten beschriebenen Schritten können Sie Kollegen ausgewählter Projektpartnerorganisationen Zugriff auf den entsprechenden Projektfragebogen gewähren.</p>
            <p>Zunächst müssen Sie einen Projektfragebogen öffnen, die erste Frage <b>Bitte geben Sie die Identifikation - den Namen - des Nachhaltigkeitsprojekts (/ -programms) an</b> beantworten und den Fragebogen speichern.</p>
            <p>Anschließend können Sie die blaue Schaltfläche <b>Mitarbeiter hinzufügen</b> verwenden. Stellen Sie jedoch zunächst sicher, dass Sie den richtigen Projektfragebogen aus der Dropdown-Liste im Menü <b>Wählen Sie ein zuvor gespeichertes Formular</b> oben auf Ihrem Bildschirm auswählen.</p>
            <p>Wenn Sie dies getan haben, wird ein zusätzliches Menü angezeigt, in dem Sie eine <b>beitragende Organisation</b> aus einer Dropdown-Liste auswählen können.</p>
            <p>Bitte wählen Sie Ihre Partnerorganisationen aus und klicken Sie auf die blaue Schaltfläche <b>Hinzufügen</b>. Die hinzugefügte Organisation wird angezeigt. Die autorisierten Plattformbenutzer dieser Organisation, die über Benutzerrechte für Projektfragebögen verfügen, werden nun automatisch per E-Mail darüber informiert, dass sie aufgefordert werden, zum Ausfüllen und / oder Überprüfen des Entwurfs des Projektfragebogens für Ihr gemeinsames Kakao-Nachhaltigkeitsprojekt / -programm beizutragen.</p>
            <p>Bitte beachten Sie, dass Sie unter den Kollegen der verschiedenen Projektpartnerorganisationen vereinbaren sollten, wer die Projektdaten ausfüllen / überprüfen soll, bevor Sie den ausgefüllten Fragebogen einreichen.</p>
            <p>Bitte beachten Sie auch, dass Sie die zuvor hinzugefügte <b>beitragende Organisation</b> weiterhin entfernen können. Klicken Sie dazu auf das <b>x</b> neben dem Namen der beitragenden Organisation.</p>
        </Fragment>
    }
]

const faq = {
    en: faqEn,
    de: faqDe
}

export { faq };
