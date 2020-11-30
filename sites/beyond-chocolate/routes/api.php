<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
use App\Models\User;
use App\Http\Controllers\EmailController as Email;
use App\Models\Role;
use App\Models\Questionnaire;
use App\Models\Questionnaires;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

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

Route::middleware(['auth:sanctum'])->get('/me', function (Request $request) {
    $user = $request->user();

    return [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'permissions' => $user->role->permissions,
        'verified' => $user->hasVerifiedEmail()
    ];
});

Route::group(['middleware' => ['auth:sanctum', 'verified']], function () {

    Route::get('/me/surveys', function (Request $request) {
        return $request->user()->questionnaires;
    });

    Route::get('/me/saved-surveys', function (Request $request) {
        return [
        ];
    });

    Route::get('/users', function () {
        return User::paginate(10);
    })->middleware('can:viewAny,App\Models\User');

    Route::get('/roles', function () {
        return Role::all();
    })->middleware('can:viewAny,App\Models\User');

    Route::get('/questionnaires', function () {
        return Questionnaire::all();
    })->middleware('can:viewAny,App\Models\User');

    Route::patch('/users/{user}', function (User $user, Request $request) {
        $input = $request->validate([
            'role' => ['sometimes', Rule::in(array_keys(config('bc.roles')))],
            'questionnaires' => ['sometimes','nullable','array']
        ]);

        if (array_key_exists('role', $input)) {
            $role = Role::get($input['role']);
            $user->role = $role;
        }

        if (array_key_exists('questionnaires', $input)) {
            $user->questionnaires = Questionnaires::fromInput($input['questionnaires']);
        }

        $user->save();

        return $user;
    })->middleware('can:update,user');

    Route::delete('/users/{user}', function (User $user) {
        $user->delete();
    })->middleware('can:delete,user');
});

Route::post('/send-email', [Email::class, 'send']);

Route::get('/flow-submitter/{id}', function ($id) {
    $user = User::find($id);
    if (is_null($user)) {
        throw new NotFoundHttpException();
    }

    return [
        'user' => $user->email,
        'org' => '' // TODO: Organisation model
    ];
});
