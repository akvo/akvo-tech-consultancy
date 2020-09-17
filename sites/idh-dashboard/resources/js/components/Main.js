import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { states, middleware } from "../reducers/reducers.js";
import logger from "redux-logger";
import Page from "./Page.js";

const store = createStore(states, applyMiddleware(middleware));

class Main extends Component {
    render() {
        return (
            <Provider store={store}>
                {" "}
                <Page />{" "}
            </Provider>
        );
    }
}

export default Main;

if (document.getElementById("app")) {
    ReactDOM.render(<Main />, document.getElementById("app"));
}
