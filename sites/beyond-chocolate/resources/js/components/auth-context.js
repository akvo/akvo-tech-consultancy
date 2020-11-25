import React from "react";
import { UserProvider, useUser } from "../lib/user-context";
import authApi from "../services/auth";
import { Route, Redirect } from "react-router-dom";

const AuthProvider = props => {
    return <UserProvider init={authApi.getUser} {...props} />;
};

const useAuth = () => {
    const { user, setUser } = useUser();

    const login = async data => {
        const sessionUser = await authApi.login(data);
        setUser(sessionUser);
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };

    return { user, login, logout };
};

const SecureRoute = ({ component: Component, ...rest }) => {
    const { user } = useUser();
    const goto = props => {
        if (user) return <Component {...rest} />;
        if (user === false)
            return (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { referrer: props.location }
                    }}
                />
            );
        return <></>;
    };

    return <Route {...rest} render={goto} />;
};

const SkipUserRoute = ({ component: Component, ...rest }) => {
    const { user } = useUser();
    const goto = () => {
        if (user) return <Redirect to="/survey" />;
        if (user === false) return <Component {...rest} />;
        return <></>;
    };

    return <Route {...rest} render={goto} />;
};

export { AuthProvider, useAuth, SecureRoute, SkipUserRoute };
