import React, { useEffect, useState } from "react";
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
import Feedback from "./pages/Feedback";
import Setting from "./pages/Setting";
import Home from "./pages/Home";
import {
    AuthProvider,
    SecureRoute,
    PublicOnlyRoute
} from "./components/auth-context";
import config from "./config";

const Main = () => {
    
    useEffect(() => {
        // todo setup app version
        console.log('setup the app version');
    }, []);

    const [formLoaded, setFormLoaded] = useState(false);

    window.onbeforeunload = (e) => {
        if (formLoaded) {
            // Cancel event as specified by spec
            e.preventDefault();
            e.returnValue = '';
        }
    }

    return (
        <BrowserRouter>
            <AuthProvider>
                <header>
                    <Navigation formLoaded={formLoaded} setFormLoaded={setFormLoaded} />
                </header>
                <main>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to={config.routes.login} />
                        </Route>
                        <Route
                            exact
                            path={config.routes.definition}
                            component={Definition}
                        />
                        <SecureRoute
                            exact
                            path={config.routes.feedback}
                            component={Feedback}
                        />
                        <SecureRoute
                            exact
                            path={config.routes.users}
                            component={Users}
                        />
                        <SecureRoute
                            exact
                            path={config.routes.home}
                            component={Home}
                        />
                        <SecureRoute
                            exact
                            path={config.routes.setting}
                            component={Setting}
                        />
                        <SecureRoute
                            exact
                            path={config.routes.survey}
                            component={WebForm}
                            setFormLoaded={setFormLoaded}
                        />
                        <PublicOnlyRoute
                            exact
                            path={config.routes.login}
                            component={Login}
                        />
                        <PublicOnlyRoute
                            exact
                            path={config.routes.register}
                            component={Register}
                        />
                        <PublicOnlyRoute
                            exact
                            path={config.routes.resetPassword}
                            component={ResetPassword}
                        />
                        <PublicOnlyRoute
                            exact
                            pages={config.routes.forgotPassword}
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
