import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { states } from "../reducers/reducers.js";
import logger from "redux-logger";
import { exampleLogic } from "../middleware/middleware.js";
import Page from "./Page.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fab, fas);

const store = createStore(states, applyMiddleware(exampleLogic));

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
