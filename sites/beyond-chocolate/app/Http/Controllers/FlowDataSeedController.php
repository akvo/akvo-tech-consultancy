<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Akvo\Api\Auth;
use Akvo\Api\FlowApi;
use Akvo\Seeds\FormSeeder;
use App\Seeds\DataPointSeeder;

class FlowDataSeedController extends Controller
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
        $seed = $this->seedFlowData();
        return "Done";
    }

    public function seedFlowData($init = true, $form_id = null)
    {
        $config = config('bc');
        $auth = new Auth();
        $token = $auth->getToken();
        if (!$token) {
            return "Invalid Access";
        }
        $api = new FlowApi($auth);

        $endpoint = env('AKVOFLOW_API_URL').'/';
        $endpoint .= env('AKVOFLOW_INSTANCE');
        $surveys = collect($config['forms']);
        # Filter surveys by form_id
        if (!is_null($form_id)) {
            $surveys = $surveys->where('surveyId', $form_id);
        }
        foreach ($surveys as $key => $value) {
            $id = $value['surveyGroupId'];
            ($init && is_null($form_id)) 
                ? $this->seedAllFlowData($api, $endpoint, $id)
                : $this->seedDataPoint($api, $endpoint, $id, $form_id);
        }
        return true;
    }

    private function seedAllFlowData($api, $endpoint, $id)
    {
        $new_endpoint = $endpoint.'/surveys/'.$id;
        $data = $api->fetch($new_endpoint);
        $survey = \Akvo\Models\Survey::updateOrCreate(
            ['id' => (int) $data['id']],
            [
                'id' => (int) $data['id'],
                'name' => $data['name'],
                'path' => '',
                'registration_id' => (int) $data['registrationFormId']
            ]
        );
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
        $dataPointSeeder = new DataPointSeeder($api, $id);
        $dataPointSeeder->seed($data);
        return;
    }

    private function seedDatapoint($api, $endpoint, $id, $form_id)
    {
        $datapoint_url = $endpoint.'/data_points?survey_id='.$id;
        $dataPointSeeder = new DataPointSeeder($api, $id);
        $dataPointSeeder->seedDatapoints($datapoint_url);
        $form_instance_url = $endpoint.'/form_instances?survey_id='.$id.'&form_id='.$form_id;
        $dataPointSeeder->seedFormInstances($form_instance_url, (int) $form_id);
        return;
    }
}
