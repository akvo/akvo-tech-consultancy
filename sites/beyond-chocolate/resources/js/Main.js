import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import WelcomeBanner from "./components/WelcomeBanner";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Users from "./pages/Users";
import WebForm from "./pages/WebForm";
import Definition from "./pages/Definition";
import {
    AuthProvider,
    SecureRoute,
    SkipUserRoute
} from "./components/auth-context";

const Main = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <header>
                    <Navigation />
                </header>
                <WelcomeBanner />
                <main>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/webform" />
                        </Route>
                        <Route
                            exact
                            path="/definition"
                            component={Definition}
                        />
                        <SecureRoute exact path="/users" component={Users} />
                        <SecureRoute
                            exact
                            path="/webform"
                            component={WebForm}
                        />
                        <SkipUserRoute exact path="/login" component={Login} />
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
