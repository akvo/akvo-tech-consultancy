import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({component:Component, ...rest}) => {
    console.log('PrivateRoute.js', rest);
    return (
        <Route {...rest} render={props => (
            rest.isLogin
                ? (rest.redirect) 
                    ? <Redirect to={rest.redirect} />
                    : <Component {...props} />
                : <Redirect to="/login" />
        )} />
    );
};

export default PrivateRoute;