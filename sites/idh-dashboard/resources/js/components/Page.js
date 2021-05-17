import React, { Component, Fragment } from "react";
import { createStore } from "redux";
import { connect } from "react-redux";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import Navigation from "./Navigation";
import Filters from "./Filters";
import { Container } from "react-bootstrap";
import axios from "axios";
import Loading from "./Loading";
import Home from "../pages/Home";
import Country from "../pages/Country";
import Compare from "../pages/Compare";
import Login from "../pages/Login";
import Setting from "../pages/Setting";
import Manage from "../pages/Manage";
import Logs from "../pages/Logs";
import Registration from "../pages/Registration";
import ForgotPassword from "../pages/ForgotPassword";
import Verify from "../pages/Verify";
import NotFound from "../pages/NotFound";
import { getApi, auth } from "../data/api";
import Methodology from "../pages/Methodology";
import PrivateRoute from "./PrivateRoute.js";

class Page extends Component {
    constructor(props) {
        super(props);
        this.initPage = this.initPage.bind(this);
    }

    initPage() {
        const now = new Date();
        let caches = localStorage.getItem("caches");
        let cachetime = localStorage.getItem("cache-time");
        let cache_version = document
            .getElementsByName("cache-version")[0]
            .getAttribute("value");
        let current_version = localStorage.getItem("cache-version");
        let access_token = localStorage.getItem("access_token");
        cachetime =
            cachetime !== null
                ? new Date(parseInt(cachetime) + 60 * 60 * 1000)
                : new Date(0); // 1 hour
        // cachetime = cachetime !== null ? new Date(parseInt(cachetime) + 1 * 15 * 1000) : new Date(0); // 15 second
        if (now > cachetime || cache_version !== current_version) {
            localStorage.clear();
            this.props.user.logout();
            // (access_token !== null) && localStorage.setItem("access_token", access_token);
            const calls = [getApi("filters")];
            Promise.all(calls).then(res => {
                caches = JSON.stringify(res[0]);
                this.props.page.init(res[0]);
                localStorage.setItem("caches", caches);
                localStorage.setItem("cache-time", now.getTime());
                localStorage.setItem("cache-version", cache_version);
            });
            return;
        }
        if (now < cachetime && cache_version === current_version) {
            caches = JSON.parse(caches);
            this.props.page.init(caches);
            return;
        }
    }

    componentDidMount() {
        let access_token = localStorage.getItem("access_token");
        this.props.page.loading(true);
        if (access_token !== null) {
            auth(access_token)
                .then(res => {
                    const { status, message } = res;
                    if (status === 401) {
                        this.props.user.logout();
                    } else {
                        this.props.user.login(res);
                    }
                })
                .catch(err => {
                    this.props.user.logout();
                    localStorage.removeItem("access_token");
                })
                .finally(this.initPage());
        } else {
            this.initPage();
        }
    }

    render() {
        let page = this.props.value.page.active;
        let loading = this.props.value.page.loading;
        let login = this.props.value.user.login;
        return (
            <BrowserRouter>
                <Navigation />
                <Filters />
                {loading ? <Loading /> : ""}
                <Container className={"page-container"} fluid={true}>
                    <Switch>
                        {/* <PrivateRoute exact path='/' isLogin={login} redirect="/home" />
                    <PrivateRoute exact path='/home' component={Home} isLogin={login} />
                    <PrivateRoute exact path='/country/:country/:companyId/:tab' component={Country} isLogin={login} />
                    <PrivateRoute exact path='/compare' component={Compare} isLogin={login} />
                    <PrivateRoute exact path='/methodology' component={Methodology} isLogin={login} />
                    <PrivateRoute exact path='/setting' component={Setting} isLogin={login} />
                    <PrivateRoute exact path='/manage-user' component={Manage} isLogin={login} />
                    <PrivateRoute exact path='/logs' component={Logs} isLogin={login} /> */}

                        <Route exact path="/">
                            <Redirect to="/home" />
                        </Route>
                        <Route exact path="/home" component={Home} />
                        <Route
                            exact
                            path="/country/:country/:companyId/:tab"
                            component={Country}
                        />
                        <Route exact path="/compare" component={Compare} />
                        <Route
                            exact
                            path="/methodology"
                            component={Methodology}
                        />
                        <Route exact path="/setting" component={Setting} />
                        <Route exact path="/manage-user" component={Manage} />
                        <Route exact path="/logs" component={Logs} />

                        <Route exact path="/login" component={Login} />
                        <Route
                            exact
                            path="/register"
                            component={Registration}
                        />
                        <Route
                            exact
                            path="/forgot_password"
                            component={ForgotPassword}
                        />
                        <Route
                            exact
                            path="/forgot_password/:verifyToken"
                            component={ForgotPassword}
                        />
                        <Route
                            exact
                            path="/verify/:verifyToken"
                            component={Verify}
                        />
                        <Route exact path="/logout">
                            <Redirect to="/login" />
                        </Route>
                        <Route
                            render={function() {
                                return <NotFound />;
                            }}
                        />
                    </Switch>
                </Container>
            </BrowserRouter>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
