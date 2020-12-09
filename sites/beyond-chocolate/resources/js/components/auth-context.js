import React from "react";
import { UserProvider, useUser } from "../lib/user-context";
import authApi from "../services/auth";
import { Route, Redirect } from "react-router-dom";
import config from "../config";
import VerifyEmail from "./VerifyEmail";

const withPermission = user => {
    if (!user.permissions) {
        return user;
    }

    return {
        ...user,
        can(permission) {
            if (!this.verified) {
                return false;
            }
            return this.permissions.includes(permission);
        }
    };
};

const initUser = async () => {
    const user = await authApi.getUser();
    return withPermission(user);
};

const AuthProvider = props => {
    return <UserProvider init={initUser} {...props} />;
};

const useAuth = () => {
    const { user, setUser } = useUser();

    const login = async data => {
        const sessionUser = await authApi.login(data);
        setUser(withPermission(sessionUser));
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };

    const updateUser = data => {
        setUser(data);
    };

    return { user, login, logout, updateUser };
};

const SecureRoute = ({ component: Component, ...rest }) => {
    const { user } = useUser();
    const goto = props => {
        if (user?.verified) return <Component {...rest} />;
        if (user) return <VerifyEmail {...rest} />;
        if (user === false)
            return (
                <Redirect
                    to={{
                        pathname: config.routes.login,
                        state: { referrer: props.location }
                    }}
                />
            );
        return <></>;
    };

    return <Route {...rest} render={goto} />;
};

const PublicOnlyRoute = ({ component: Component, ...rest }) => {
    const { user } = useUser();
    const goto = () => {
        if (user) return <Redirect to={config.userLanding} />;
        if (user === false) return <Component {...rest} />;
        return <></>;
    };

    return <Route {...rest} render={goto} />;
};

export { AuthProvider, useAuth, SecureRoute, PublicOnlyRoute };
