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
    PublicOnlyRoute
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
                        <PublicOnlyRoute
                            exact
                            path={config.routes.login}
                            component={Login}
                        />
                        <PublicOnlyRoute
                            exact
                            path="/register"
                            component={Register}
                        />
                        <PublicOnlyRoute
                            exact
                            path="/reset-password/:token"
                            component={ResetPassword}
                        />
                        <PublicOnlyRoute
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
