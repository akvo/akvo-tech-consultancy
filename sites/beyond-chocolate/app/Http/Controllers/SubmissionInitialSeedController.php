<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Akvo\Api\Auth;
use Akvo\Api\FlowApi;
use Akvo\Seeds\FormSeeder;
use App\Seeds\DataPointSeeder;

class SubmissionInitialSeedController extends Controller
{
    public function initialSeed(Request $request)
    {
        $config = config('bc');
        $credentials = $config['credentials'];
        if ($request->password !== $credentials['api']) {
            throw new NotFoundHttpException();
        }

        # TODO :: Check if akvo:migrate already run (table exist)
        $exist = Schema::hasTable('form_instances');
        if (!$exist) {
            # TODO :: call akvo:migrate
            \Artisan::call('akvo:migrate');
        }

        # TODO :: seed flow tables
        $auth = new Auth();
        $token = $auth->getToken();
        if (!$token) {
            return "Invalid Access";
        }
        $api = new FlowApi($auth);

        $endpoint = env('AKVOFLOW_API_URL').'/';
        $endpoint .= env('AKVOFLOW_INSTANCE');
        $surveys = collect($config['forms']);
        foreach ($surveys as $key => $survey) {
            $id = $survey['surveyGroupId'];
            $new_endpoint = $endpoint.'/surveys/'.$id;
            $data = $api->fetch($new_endpoint);
            echo('Seeding Surveys');
            $survey = \Akvo\Models\Survey::updateOrCreate(
                ['id' => (int) $data['id']],
                [
                    'id' => (int) $data['id'],
                    'name' => $data['name'],
                    'path' => '',
                    'registration_id' => (int) $data['registrationFormId']
                ]
            );
            echo(PHP_EOL.'Done Seeding Surveys'.PHP_EOL);
            echo('Seeding Forms');
            foreach($data['forms'] as $form) {
                $input = \Akvo\Models\Form::updateOrCreate(
                    ['id' => (int) $form['id']],
                    [
                        'id' => (int) $form['id'],
                        'survey_id' => (int) $data['id'],
                        'name' => $form['name']
                    ]
                );
            }
            $formSeeder = new FormSeeder($api);
            $formSeeder->seed();
            echo(PHP_EOL.'Done Seeding Forms'.PHP_EOL);
            $dataPointSeeder = new DataPointSeeder($api, $id);
            $dataPointSeeder->seed($data);
        }

        return "Done";
    }
}
