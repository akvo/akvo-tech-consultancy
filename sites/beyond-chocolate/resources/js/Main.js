import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HeaderPanel from "./components/HeaderPanel";
import Navigation from "./components/Navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login2 from "./pages/Login2";
import Register2 from "./pages/Register2";
import ForgotPassword2 from "./pages/ForgotPassword2";
import ResetPassword2 from "./pages/ResetPassword2";
import Users from "./pages/Users";
import WebForm from "./pages/WebForm";
import Definition from "./pages/Definition";
import Feedback from "./pages/Feedback";
import Setting from "./pages/Setting";
import Home from "./pages/Home";
import Impressum from "./pages/Impressum";
import Faq from "./pages/Faq";
import {
    AuthProvider,
    SecureRoute,
    PublicOnlyRoute
} from "./components/auth-context";
import config from "./config";
import authApi from "./services/auth";
import GettingStarted from "./pages/GettingStarted";
import Submission from "./pages/Submission";

const Main = () => {

    useEffect(async () => {
        localStorage.clear();
        // check cache time / login expired
        // const now = new Date();
        // let cachetime = localStorage.getItem("cache-time");
        // let cache_version = document.getElementsByName("cache-version")[0].getAttribute("value");
        // let current_version = localStorage.getItem("cache-version");
        // let expiredon_cachetime = cachetime !== null ? new Date(parseInt(cachetime) + 2 * 60 * 60 * 1000) : new Date(0); // 2 hours
        // if ((now > expiredon_cachetime || cache_version !== current_version) && cachetime !== null) {
        //     localStorage.clear();
        //     await authApi.logout();
        //     window.location.reload();
        //     return;
        // }
        // if (now < expiredon_cachetime && cache_version === current_version) {
        //     let ct = localStorage.getItem("cache-time");
        //     let cv = localStorage.getItem("cache-version");
        //     localStorage.clear();
        //     localStorage.setItem("cache-time", ct);
        //     localStorage.setItem("cache-version", cv);
        //     return;
        // }
    }, []);

    const [formLoaded, setFormLoaded] = useState(false);
    const [webForm, setWebForm] = useState(null);

    window.onbeforeunload = (e) => {
        if (formLoaded) {
            // Cancel event as specified by spec
            e.preventDefault();
            e.returnValue = '';
        }
    };
    return (
        <BrowserRouter>
            <AuthProvider>
                <header>
            <Header formLoaded={formLoaded} setFormLoaded={setFormLoaded} />
                    {/* <Navigation formLoaded={formLoaded} setFormLoaded={setFormLoaded} /> */}
                    <HeaderPanel />
                </header>
                <main>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to={config.routes.login} />
                        </Route>
                        {/* <Route
                            exact
                            path={config.routes.gettingStarted}
                            component={GettingStarted}
                        /> */}
                         <SecureRoute
                            exact
                            path={config.routes.submission}
                            component={Submission}
                        />
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
                            path={config.routes.impressum}
                            component={Impressum}
                        />
                        <SecureRoute
                            exact
                            path={config.routes.faq}
                            component={Faq}
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
                            setWebForm={setWebForm}
                            webForm={webForm}
                        />
                        <PublicOnlyRoute
                            exact
                            path={config.routes.login}
                            component={Login2}
                        />
                        <PublicOnlyRoute
                            exact
                            path={config.routes.register}
                            component={Register2}
                        />
                        <PublicOnlyRoute
                            exact
                            path={config.routes.resetPassword}
                            component={ResetPassword2}
                        />
                        <PublicOnlyRoute
                            exact
                            pages={config.routes.forgotPassword}
                            component={ForgotPassword2}
                        />
                    </Switch>
                </main>
                {/*
                <footer>
                    <Footer />
                </footer>
                */}
            </AuthProvider>
        </BrowserRouter>
    );
};

export default Main;
