<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        return $this->checkPermission($user);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\AppModelsUser  $appModelsUser
     * @return mixed
     */
    public function view(User $user, User $target)
    {
        return $this->checkPermission($user);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $this->checkPermission($user);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\AppModelsUser  $appModelsUser
     * @return mixed
     */
    public function update(User $user, User $target)
    {
        return $this->checkPermission($user);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\AppModelsUser  $appModelsUser
     * @return mixed
     */
    public function delete(User $user, User $target)
    {
        return $this->checkPermission($user);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\AppModelsUser  $appModelsUser
     * @return mixed
     */
    public function restore(User $user, User $target)
    {
        return $this->checkPermission($user);
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\AppModelsUser  $appModelsUser
     * @return mixed
     */
    public function forceDelete(User $user, User $target)
    {
        return $this->checkPermission($user);
    }

    private function checkPermission(User $user)
    {
        if (! $user->verified) {
            return false;
        }
        if (! $user->role instanceof Role) {
            return false;
        }

        return is_array('managet-user', $user->role->permissions);
    }
}
