import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
                <main>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/survey" />
                        </Route>
                        <Route
                            exact
                            path="/definition"
                            component={Definition}
                        />
                        <SecureRoute exact path="/users" component={Users} />
                        <SecureRoute exact path="/survey" component={WebForm} />
                        <SkipUserRoute exact path="/login" component={Login} />
                        <SkipUserRoute
                            exact
                            path="/register"
                            component={Register}
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
