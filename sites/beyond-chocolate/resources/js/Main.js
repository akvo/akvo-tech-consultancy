import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Users from "./pages/Users";
import WebForm from "./pages/WebForm";
import Definition from "./pages/Definition";
import {
    AuthProvider,
    SecureRoute,
    SkipUserRoute
} from "./components/auth-context";
import config from "./config";

const Main = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <header>
                    <Navigation />
                </header>
                <main>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to={config.routes.home} />
                        </Route>
                        <Route
                            exact
                            path="/definition"
                            component={Definition}
                        />
                        <SecureRoute exact path="/users" component={Users} />
                        <SecureRoute
                            exact
                            path={config.routes.home}
                            component={WebForm}
                        />
                        <SkipUserRoute
                            exact
                            path={config.routes.login}
                            component={Login}
                        />
                        <SkipUserRoute
                            exact
                            path="/register"
                            component={Register}
                        />
                        <SkipUserRoute
                            exact
                            path="/reset-password/:token"
                            component={ResetPassword}
                        />
                        <SkipUserRoute
                            exact
                            pages="/forgot-password"
                            component={ForgotPassword}
                        />
                    </Switch>
                </main>
                <footer>
                    <Footer />
                </footer>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default Main;
