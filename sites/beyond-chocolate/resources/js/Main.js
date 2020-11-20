import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import WelcomeBanner from "./components/WelcomeBanner";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Users from "./pages/Users";
import WebForm from "./pages/WebForm";
import Definition from "./pages/Definition";

const Main = function() {
    return (
        <BrowserRouter>
            <header>
                <Navigation />
            </header>
            <WelcomeBanner />
            <main>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/login" />
                    </Route>
                    <Route exact path="/home">
                        <Redirect to="/login" />
                    </Route>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/users" component={Users} />
                    <Route exact path="/webform" component={WebForm} />
                    <Route exact path="/definition" component={Definition} />
                </Switch>
            </main>
            <footer>
                <Footer />
            </footer>
        </BrowserRouter>
    );
};

export default Main;
