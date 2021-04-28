<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \Mailjet\Resources;
use \Mailjet\LaravelMailjet\Facades\Mailjet;
use App\Helpers\Mails;
use App\Models\User;
use App\Models\Organization;
use App\Models\Secretariat;

/**
 * Need to change this email into new mail helpers
 */

class EmailController extends Controller
{
    public function sendFeedback(Request $request, Mails $mails)
    {
        $footer = "Cocoa Monitoring";
        $recipients = config('mail.mailing.list');
        $recipients = collect($recipients)->map(function($address){
            return [
                'Email' => $address
            ];
        })->push(['Email' => $request->email]);
        $subject = $request->subject;
        $body = "Feedback from: <strong>$request->email</strong><br/><br/>
                $request->message <hr/>
                <strong>SENT VIA <a href='".env('APP_URL')."'>".$footer."</a></strong>
                <br/>";
        $text = "Feedback from: $request->email";
        $response = $mails->sendEmail($recipients, false, $subject, $body, $text);

        return response([
            'message' => 'Your feedback has been sent!', 'mails' => $response
        ]);
    }
    //
    public function informUser(Request $request, Mails $mails)
    {
        $user = User::where('email', $request->email)->first();
        $secretariats = array();
        foreach($user->organization->secretariats as $s){
            $secretariats[] = ($s->id == 1 ? 'Julia Jawtusch' : 'Marloes Humbeeck');
        }
        $signed_en = (count($secretariats) > 0 ? implode ( " or ", $secretariats) : $request->adminName);
        $signed_de = (count($secretariats) > 0 ? implode ( " oder ", $secretariats) : $request->adminName);
        $recipients = [['Email' => $request->email, 'Name' => $request->name]];
        $subject = config('app.name').": ".$request->subject;
        $questionnaires = array_map(function($q){return '<li>' . $q . '</li>';}, $request->questionnaires);
        $questionnaires = implode("\n", $questionnaires);
        $body = "Dear Mr./Ms. $request->name<br/><br/>
                $request->adminName from $request->adminOrg has assigned you the following surveys in the European Initiatives for Sustainable Cocoa Monitoring for 2020 data portal for your input:
                <ul>
                $questionnaires
                </ul>

                <p>Please note that the projects' questionnaire applies only to
                you if you implement a cocoa sustainability project/ program in
                a country of origin. If you do not implement any projects, you
                can ignore the projects' questionnaire. For Beyond Chocolate members,
                the project questionnaire is only obligatory for sustainability programs
                and standards. </p>

                <p>If you are partner to a joint project by two or more platform
                members, please note that this project should be reported only
                once. If you are not the coordinating partner the partner assigned
                to report on that project, you will be informed automatically via email once
                you were added by the coordinating partner as a partner to that
                particular project. This will allow all partners to be involved
                in a single reporting of a joint cocoa sustainability project/
                program.</p>

                <strong>Please visit <a href='".env('APP_URL')."'>".env('APP_URL')."</a> and log in to fill in your data.</strong><br/>
                In case of any issue please contact $signed_en directly or use the feedback form on the portal.<br/>
                <hr />
                Liebe/r Herr/ Frau $request->name<br/><br/>
                $request->adminName von $request->adminOrg hat im  Daten-Portal für das Monitoring für 2020 der Europäischen Initiativen für Nachhaltigen Kakao die folgenden Fragebögen für Sie freigeschaltet:
                <ul>
                $questionnaires
                </ul>

                <p>Bitte beachten Sie, dass der Projekt-Fragebogen nur dann
                relevant für Sie ist, falls Sie ein
                Kakao-Nachhaltigkeits-Projekt/-Programm in einem Ursprungsland
                durchführen oder daran beteiligt sind. Wenn Sie keine Projekte
                haben, können Sie diesen Fragebogen ignorieren.
                Für Beyond Chocolate Mitglieder ist der Projektfragebogen nur
                für Nachhaltigkeitsprogramme und – standards relevant.</p>

                <p>Falls Sie Partner eines gemeinsamen Projektes von zwei oder
                mehr Mitgliedern der Kakaoplattform sind, beachten Sie bitte,
                dass über jedes Projekt nur einmal berichtet werden soll. Falls
                Sie nicht der koordinierende Partner für dieses Projekt sind,
                bzw. den Auftrag haben, über das Projekt zu berichten, werden Sie
                automatisch per Email informiert, sobald Sie von dem koordinierenden
                Partner als Projektpartner hinzugefügt wurden. Dies erlaubt es allen
                Projektpartnern, an der Berichterstattung zu einem gemeinsamen
                Kakao-Nachhaltigkeitsprojekt (/-programm) mitzuwirken.</p>

                <strong>Bitte besuchen Sie die Seite  <a href='".env('APP_URL')."'>".env('APP_URL')."</a> und loggen sich dort ein, um Ihre Daten einzugeben.</strong><br/>
Falls Sie Schwierigkeiten haben, können Sie $signed_de kontaktieren oder das Feedback-Formular auf der Webseite nutzen.<br/>";
        $text = "$request->adminName from $request->adminOrg has assigned surveys in the Cocoa monitoring data portal for your input";
        $response = $mails->sendEmail($recipients, false, $subject, $body, $text);

        return response([
            'message' => 'The user has been informed!', 'mails' => $response
        ]);
    }

}
