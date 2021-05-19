<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use App\Models\User;
use App\Http\Controllers\EmailController as Email;
use App\Models\Role;
use App\Models\Questionnaire;
use App\Models\Questionnaires;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use App\Http\Controllers\AuthController as Auth;
use App\Http\Controllers\ApiController as Api;
use App\Http\Controllers\SeedController as Seed;
use App\Http\Controllers\UserSavedFormsController;
use App\Http\Controllers\NotificationController as Notification;
use Illuminate\Contracts\Auth\StatefulGuard;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\FetchSubmissionUuidController;
use App\Http\Controllers\SubmissionController;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use App\Http\Controllers\FlowDataSeedController;
use App\Http\Controllers\FlowDataSyncController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/me', function (Request $request, Auth $auth, StatefulGuard $guard) {
    $user = $request->user();
    $check = $auth->checkLastActivity($request, $guard);
    return [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'permissions' => $user->role->permissions,
        'organization_id' => $user->organization_id,
        'verified' => $user->hasVerifiedEmail(),
        'project_fids' => config('webform.forms.project.fids'),
        'questionnaires' => $user->questionnaires,
        'formUrl' => null,
        'formActive' => null,
        'last_activity' => $user->last_activity,
        'hash' => Crypt::encryptString($user->id),
        // 'hash' => Hash::make($user->id),
        // 'check_last_activity' => $check
    ];
});

Route::group(['middleware' => ['auth:sanctum', 'verified']], function () {

    Route::get('/me/surveys', function (Request $request, Auth $auth, StatefulGuard $guard) {
        $user = $request->user();
        $check = $auth->checkLastActivity($request, $guard);
        $res['last_activity'] = $check;
        if (in_array('manage-surveys', $user->role->permissions)) {
            $res['data'] = Questionnaire::all();
            return $res;
        }
        $res['data'] = $user->questionnaires;
        return $res;
    });

    Route::get('/me/saved-surveys', UserSavedFormsController::class);

    Route::get('/users', function (Request $request, Auth $auth, StatefulGuard $guard) {
        // return User::paginate(10);
        $check = $auth->checkLastActivity($request, $guard);
        $res['last_activity'] = $check;
        $res ['data'] = User::with(['organization.parents', 'organization.secretariats'])->paginate(10);
        return $res;
    })->middleware('can:viewAny,App\Models\User');

    Route::get('/roles', function () {
        return Role::all();
    })->middleware('can:viewAny,App\Models\User');

    Route::get('/questionnaires', function () {
        return Questionnaire::all();
    })->middleware('can:viewAny,App\Models\User');

    Route::patch('/users/{user}', function (User $user, Request $request) {
        $input = $request->validate([
            'name' => ['required'],
            'role' => ['sometimes', Rule::in(array_keys(config('bc.roles')))],
            'questionnaires' => ['sometimes','nullable','array'],
            'organization_id' => ['required']
        ]);

        if (array_key_exists('role', $input)) {
            $role = Role::get($input['role']);
            $user->role = $role;
        }

        if (array_key_exists('questionnaires', $input)) {
            $user->questionnaires = Questionnaires::fromInput($input['questionnaires']);
        }

        $user->name = $input['name'];
        $user->organization_id = $input['organization_id'];
        $user->save();

        return $user;
    })->middleware('can:update,user');

    Route::delete('/users/{user}', function (User $user) {
        $user->delete();
    })->middleware('can:delete,user');

    Route::get('/collaborators/{web_form_id}', [Api::class, 'getCollaboratorAssignments']);
    Route::post('/collaborators/{web_form_id}/{organization_id}', [Api::class, 'addCollaboratorAssignment']);
    Route::delete('/collaborators/{web_form_id}/{organization_id}', [Api::class, 'deleteCollaboratorAssignment']);
});

Route::post('/send-email', [Email::class, 'sendFeedback']);
Route::post('/inform-user', [Email::class, 'informUser']);

Route::get('/flow-submitter/{id}', function (Request $request, Auth $auth) {
    // $user = User::find($request->id);
    // $user = $auth->checkUserIdHash($request->id);
    try {
        $userId = Crypt::decryptString($request->id);
        $user = User::find($userId);
    } catch (DecryptException $e) {
        $user = null;
    }
    if (is_null($user)) {
        throw new NotFoundHttpException();
    }
    if (is_null($user->email_verified_at) || is_null($user->last_activity)) {
        throw new NotFoundHttpException();
    }
    // check user last_activity
    $diff = $auth->getUserTimeDiff($user);
    if ($diff->d >=1 || $diff->h >= 2) {
        throw new NotFoundHttpException();
    }

    return [
        'id' => $user->id,
        'user' => $user->email,
        'org' => $user->organization_id,
    ];
});

Route::post('/auth/forgot-password', [Auth::class, 'forgotPassword']);
Route::post('/auth/reset-password', [Auth::class, 'resetPassword']);
Route::middleware(['auth:sanctum'])->post('/user/update', [Auth::class, 'update']);
Route::get('/secretariats', [Api::class, 'getSecretariat']);
Route::get('/organizations', [Api::class, 'getOrganizations2']);
Route::get('/config', [Api::class, 'getConfig']);
Route::post('/submission', [Api::class, 'postWebForm']);
Route::patch('/submission', [Api::class, 'updateWebForm']);
Route::get('/submission/{organization_id}', [Api::class, 'getWebForm']);
Route::get('/submission/check/{organization_id}', [Api::class, 'checkWebFormOnLoad']);
Route::get('/submission/check/{organization_id}/{form_id}', [Api::class, 'checkWebForm']);
Route::get('/job/project/notification', [Notification::class, 'projectNotification']);
Route::get('/flow/check-survey/{survey_id}', [Notification::class, 'checkSurvey']);

# Seeder
Route::get('/seed/organizations', [Seed::class, 'seedOrganizations']);
Route::get('/seed/users/{password}', [Seed::class, 'seedUser']);

# Reports
Route::get('/reports/submission/{password}', [ReportController::class, 'generateSubmissionReport']);
Route::get('/reports/user-with-saved-submission/{password}', [ReportController::class, 'generateUserWithSavedSubmissionReport']);

# Scripts
Route::get('/scripts/fetch-submission-uuid', [FetchSubmissionUuidController::class, 'fetch']);

# Submitted Data
Route::middleware(['auth:sanctum'])->get('/submissions/submitted', [SubmissionController::class, 'getSubmittedData']);
// Route::middleware(['auth:sanctum'])->get('/submissions/download/{form_id}/{instance_id}/{filename}', [SubmissionController::class, 'downloadData']); # TO::DELETE
Route::middleware(['auth:sanctum'])->get('/submissions/sync-download/{webform_id}/{form_id}/{uuid}/{filename}', [SubmissionController::class, 'syncAndDownloadData']);

# Flow Data
Route::get('/flow/initial-seed/{password}', [FlowDataSeedController::class, 'initialSeed']); # INITIAL SEEDER FLOW DATA
Route::get('/flow/sync', [FlowDataSyncController::class, 'syncData']); # SYNC DATA USING FLOW SYNC API


Route::get('/flow/all-csv/{password}', [SubmissionController::class, 'allCsv']); # generate-all-csvs
