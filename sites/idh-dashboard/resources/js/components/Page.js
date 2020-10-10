import React, { Component, Fragment } from "react";
import { createStore } from "redux";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import Navigation from "./Navigation";
import Filters from "./Filters";
import { Container } from "react-bootstrap";
import axios from "axios";
import Loading from "../pages/Loading";
import Home from "../pages/Home";
import Country from "../pages/Country";
import Compare from "../pages/Compare";
import Login from "../pages/Login";
import { getApi, auth } from "../data/api";

class Page extends Component {
    constructor(props) {
        super(props);
        this.renderPage = this.renderPage.bind(this);
        this.initPage = this.initPage.bind(this);
    }

    initPage() {
        const now = new Date();
        let caches = localStorage.getItem("caches");
        let cachetime = localStorage.getItem("cache-time");
        let cache_version = document.getElementsByName("cache-version")[0].getAttribute("value");
        let current_version = localStorage.getItem("cache-version");
        cachetime = cachetime !== null ? new Date(parseInt(cachetime) + 60 * 60 * 1000) : new Date(0);
        if (now > cachetime || cache_version !== current_version) {
            localStorage.clear();
            const calls = [getApi("filters")];
            Promise.all(calls).then((res) => {
                caches = JSON.stringify(res[0]);
                this.props.page.init(res[0]);
                localStorage.setItem("caches", caches);
                localStorage.setItem("cache-time", now.getTime());
                localStorage.setItem("cache-version", cache_version);
                this.props.page.loading(false);
            });
        }
        if (now < cachetime && cache_version === current_version) {
            caches = JSON.parse(caches);
            this.props.page.init(caches);
            this.props.page.loading(false);
        }
    }

    componentDidMount() {
        let access_token = localStorage.getItem("access_token");
        if (access_token !== null) {
            auth(access_token)
                .then((res) => {
                    console.log(res);
                    this.props.user.login(res);
                })
                .catch((err) => {
                    localStorage.removeItem("access_token");
                    this.props.user.logout();
                })
                .finally(this.initPage());
        } else {
            this.initPage();
        }
    }

    renderPage(page) {
        switch (page) {
            case "home":
                return <Home />;
            case "country":
                return <Country />;
            case "compare":
                return <Compare />;
            case "login":
                return <Login />;
            default:
                return "";
        }
    }

    render() {
        let page = this.props.value.page.active;
        let loading = this.props.value.page.loading;
        return (
            <Fragment>
                <Navigation />
                <Filters />
                {loading ? <Loading /> : ""}
                <Container className={"page-container"} fluid={true}>
                    {this.renderPage(page)}
                </Container>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
