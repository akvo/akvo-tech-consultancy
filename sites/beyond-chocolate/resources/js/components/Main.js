import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import WelcomeBanner from "./WelcomeBanner";
import Navigation from "./Navigation";
import Login from "../pages/Login";
import Users from "../pages/Users";

const Main = function() {
    return (
        <BrowserRouter>
            <Navigation />
            <WelcomeBanner />
            <Switch>
                <Route exact path="/">
                    <Redirect to="/login" />
                </Route>
                <Route exact path="/login" component={Login} />
                <Route exact path="/users" component={Users} />
            </Switch>
        </BrowserRouter>
    );
};

export default Main;

if (document.getElementById("app")) {
    ReactDOM.render(<Main />, document.getElementById("app"));
}
